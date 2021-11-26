import { Device } from "mediasoup-client";
import { mediaTypes } from "../utility/mediasoupConfigs";
import { errorToast } from "../utility/toastSettings";

export default class LiveStream {
  constructor(
    socket,
    videoEl,
    audioEl,
    broadcastId,
    peerId,
    isStreamer,
    deleteLiveStream,
    hasVideoHandler,
    hasAudioHandler,
    countHandler
  ) {
    this.videoEl = videoEl;
    this.audioEl = audioEl;
    this.broadcastId = broadcastId;
    this.isStreamer = isStreamer;
    this.peerId = peerId;
    this.hasVideo = false;
    this.hasVideoHandler = hasVideoHandler;
    this.hasAduio = false;
    this.hasAduioHandler = hasAudioHandler;
    this.countHandler = countHandler;
    this.socket = socket;
    this.producerTransport = null;
    this.consumerTransport = null;
    this.device = null;
    this.consumers = [];
    this._isOpen = false;
    this.failed = false;
    this.deleteLiveStream = deleteLiveStream;
    this.initLiveStream(this.broadcastId, this.peerId);
  }

  initLiveStream = async (broadcastId, peerId) => {
    this.initSockets();
    console.log("peerID", peerId);
    console.log("joining broadcast");

    const joinResponse = await this.socket
      .request("joinBroadcast", {
        broadcastId,
        peerId,
      })
      .catch((err) => this.requestFail("joinBroadcast"));
    if (this.failed) return;

    const device = await this.createDevice(joinResponse.RouterRtpCapabilities);
    this.device = device;

    await this.initRecvTransports(peerId, device, joinResponse.WebRtcTransport);

    this._isOpen = true;

    const producers = await this.socket.request("getProducers", {
      broadcastId,
      peerId,
    });

    console.log("getProducersReponse: ", producers);
    for (let producer of producers) {
      await this.consume(producer.producerId, this.peerId, this.isStreamer);
    }
  };

  createDevice = async (routerRtpCapabilities) => {
    let device;
    try {
      device = new Device();
      console.log("Device created.");
    } catch (error) {
      if (error.name === "UnsupportedError") {
        console.log("browser not supported");
      } else {
        console.log("Device not created");
        return;
      }
      console.error(error);
    }
    try {
      await device.load({ routerRtpCapabilities });
      console.log("Device loaded.");
    } catch (err) {
      console.log("Couldn't load the device.");
      console.error(err);
    }
    return device;
  };

  initSendTransports = async (peerId, device, isStreamer) => {
    const data = await this.socket
      .request("createWebRtcTransport", {
        peerId,
        isStreamer,
      })
      .catch((err) => {
        this.requestFail("createWebRtcTransport");
      });

    this.producerTransport = device.createSendTransport(data);
    console.log("streamer send transport created.", this.producerTransport);

    this.producerTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errBack) => {
        try {
          await this.socket.request("connectTransport", {
            dtlsParameters,
            transportId: data.id,
            peerId,
          });
          callback();
        } catch (err) {
          errBack(err);
          this.requestFail("connectTransport");
        }
      }
    );

    this.producerTransport.on(
      "produce",
      async ({ kind, rtpParameters }, callback, errback) => {
        try {
          const data = await this.socket.request("produce", {
            producerWebRtcTransportId: this.producerTransport.id,
            kind,
            rtpParameters,
            peerId,
          });
          callback({ id: data.ProducerId });
          console.log("produceResponse", data);
        } catch (err) {
          errback(err);
        }
      }
    );

    this.producerTransport.on("connectionstatechange", function (state) {
      switch (state) {
        case "connecting":
          break;

        case "connected":
          //localVideo.srcObject = stream
          break;

        case "failed":
          this.producerTransport.close();
          break;

        default:
          break;
      }
    });
    return this.producerTransport;
  };

  initRecvTransports = async (peerId, device, data) => {
    // const data = await this.socket
    //   .request("createWebRtcTransport", {
    //     peerId,
    //     isStreamer,
    //   })
    //   .catch((err) => {
    //     this.requestFail("createWebRtcTransport");
    //   });
    this.consumerTransport = device.createRecvTransport(data);
    console.log("consumer recieve transport created.");

    const requestFail = this.requestFail;
    const theSocket = this.socket;
    this.consumerTransport.on(
      "connect",
      async function ({ dtlsParameters }, callback, errBack) {
        try {
          console.log("connecting transport");
          await theSocket.request("connectTransport", {
            dtlsParameters,
            transportId: data.id,
            peerId,
          });
          callback();
        } catch (error) {
          errBack(error);
          requestFail("connectTransport");
        }
      }
    );

    this.consumerTransport.on("connectionstatechange", function (state) {
      switch (state) {
        case "connecting":
          break;

        case "connected":
          //remoteVideo.srcObject = stream
          //await socket.request('resume');
          break;

        case "failed":
          this.consumerTransport.close();
          break;

        default:
          break;
      }
    });
    return this.consumerTransport;
  };

  consume = async (producerId, peerId) => {
    let codecOptions = {};
    const { rtpCapabilities } = this.device;
    console.log("producerId: " + producerId);
    console.log("Consumer Transport ID:", this.consumerTransport.id);
    const { id, kind, rtpParameters } = await this.socket
      .request("consume", {
        rtpCapabilities,
        consumerTransportId: this.consumerTransport.id, // might be
        producerId,
        peerId,
      })
      .catch((err) => {
        this.requestFail("consume");
      });
    console.log("consume options: ", {
      rtpParameters,
      id: this.consumerTransport.id, // might be
      producerId,
      peerId,
      kind,
    });
    try {
      const consumer = await this.consumerTransport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
        codecOptions,
      });
      console.log("consumer created: ", consumer, "kind: ", kind);
      this.consumers.push({ id, producerId, kind });
      if (kind === mediaTypes.video) {
        this.hasVideo = true;
        this.hasVideoHandler(true);
      } else if (kind === mediaTypes.audio) {
        this.hasAduio = true;
        this.hasAduioHandler(true);
      }

      await this.socket
        .request("resumeConsumer", { consumerId: id })
        .catch((err) => {
          console.log(err);
          this.requestFail("resumeConsumer");
        });
      console.log("resume Consumer called");

      console.log("new consumers array:", this.consumers);
      const stream = new MediaStream();
      stream.addTrack(consumer.track);
      console.log("the data to be streamed: ", stream);
      let elem;
      if (kind === mediaTypes.video) {
        elem = document.createElement("video");
        elem.srcObject = stream;
        elem.id = consumer.id;
        elem.playsinline = false;
        elem.autoplay = true;
        elem.className = "vid";
        console.log("before appending videoEl", elem);
        this.videoEl.appendChild(elem);
      } else {
        elem = document.createElement("audio");
        elem.srcObject = stream;
        elem.id = consumer.id;
        elem.playsinline = false;
        elem.autoplay = true;
        this.audioEl.appendChild(elem);
      }
      const removeConsumer = this.removeConsumer;
      consumer.on("trackended", function () {
        console.log("trackEnded");
        removeConsumer(consumer.id);
      });
      consumer.on("transportclose", function () {
        console.log("transportclose: ", consumer.id);
        removeConsumer(consumer.id);
      });
    } catch (err) {
      this.requestFail("consume Function");
      console.log(err);
    }
  };

  initSockets = () => {
    this.socket.on("consumerClosed", (consumer_id) => {
      this.removeConsumer(consumer_id);
    });

    this.socket.on("consumerPaused", (consumer_id) => {
      this.pauseConsumer(consumer_id);
    });

    this.socket.on("consumerResumed", (consumer_id) => {
      this.resumeConsumer(consumer_id);
    });

    this.socket.on("getNewProducer", (producer) => {
      console.log("new producer: ", producer);
      this.consume(producer, this.peerId, this.isStreamer);
    });

    this.socket.on("participantsCount", (count) => {
      console.log("new Count:", count);
      this.countHandler(count);
    });

    this.socket.on("broadcastClosed", (broadcastId) => {
      console.log("broadcast Closed called");
      this.exit(true, true);
    });

    const exitFunc = this.exit;
    this.socket.on("disconnect", function () {
      exitFunc(false);
    });
  };

  pauseConsumer = (consumer_id) => {
    console.log("pausing consumer: ", consumer_id);
    console.log("consumer Element: ", document.getElementById(consumer_id));
    let elem = document.getElementById(consumer_id);
    elem.pause();
    const consumerIndex = this.consumers.findIndex((e) => e.id === consumer_id);
    console.log("consumer paused");
    if (this.consumers[consumerIndex].kind === mediaTypes.video) {
      this.hasVideo = false;
      this.hasVideoHandler(false);
    } else if (this.consumers[consumerIndex].kind === mediaTypes.audio) {
      this.hasAduio = false;
      this.hasAduioHandler(false);
    }
  };

  resumeConsumer = (consumer_id) => {
    console.log("resuming consumer: ", consumer_id);
    console.log("consumer Element: ", document.getElementById(consumer_id));
    let elem = document.getElementById(consumer_id);
    elem.play();
    const consumerIndex = this.consumers.findIndex((e) => e.id === consumer_id);
    if (this.consumers[consumerIndex].kind === mediaTypes.video) {
      this.hasVideo = true;
      this.hasVideoHandler(true);
    } else if (this.consumers[consumerIndex].kind === mediaTypes.audio) {
      this.hasAduio = true;
      this.hasAduioHandler(true);
    }
  };

  removeConsumer = (consumer_id) => {
    console.log("removing consumer: ", consumer_id);
    console.log("consumer Element: ", document.getElementById(consumer_id));
    let elem = document.getElementById(consumer_id);
    elem.srcObject.getTracks().forEach(function (track) {
      track.stop();
    });
    elem.parentNode.removeChild(elem);
    const consumerIndex = this.consumers.findIndex((e) => e.id === consumer_id);
    if (this.consumers[consumerIndex].kind === mediaTypes.video) {
      this.hasVideo = false;
      this.hasVideoHandler(false);
    }
    this.consumers.splice(consumerIndex, 1);
  };

  exit = async (offline = false, isEnded = false) => {
    if (!offline) {
      const exitBroadcastResponse = await this.socket
        .request("exitBroadcast", {
          broadcastId: this.broadcastId,
          peerId: this.peerId,
          isStreamer: this.isStreamer,
        })
        .catch((err) => {});
      this.clean(isEnded);
    } else {
      this.clean(isEnded);
    }
  };

  requestFail(req) {
    console.log(`${req} method failed`);
    errorToast("مشکلی از سمت سرور پیش آمده");
    this.failed = true;
    this.deleteLiveStream();
  }

  clean = (isEnded) => {
    this._isOpen = false;
    if (this.consumerTransport) {
      console.log("closing Transport with ID:", this.consumerTransport.id);
      this.consumerTransport.close();
    }
    if (this.producerTransport) {
      this.producerTransport.close();
    }
    this.socket.socket.off("disconnect");
    this.socket.socket.off("getProducers");
    this.socket.socket.off("getNewProducer");
    this.socket.socket.off("participantsCount");
    this.socket.socket.off("broadcastClosed");
    this.socket.socket.off("consumerClosed");
    this.deleteLiveStream(isEnded);
  };

  isOpen() {
    return this._isOpen;
  }
}
