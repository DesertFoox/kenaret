import { Device } from "mediasoup-client";

import { mediaTypes } from "../utility/mediasoupConfigs";
import { errorToast } from "../utility/toastSettings";

export default class Broadcast {
  constructor(
    socket,
    broadcastId,
    mediaEl,
    audioInput,
    videoInput,
    broadcastTitle,
    peerId,
    isStreamer,
    deleteBroadcast,
    hasVideoHandler,
    hasAudioHandler,
    countHandler,
    accessToken,
    refreshToken
  ) {
    this.mediaEl = mediaEl;
    this.audioInput = audioInput;
    this.videoInput = videoInput;
    this.broadcastTitle = broadcastTitle;
    this.broadcastId = broadcastId;
    this.isStreamer = isStreamer;
    this.peerId = peerId;
    this.hasVideo = false;
    this.hasVideoHandler = hasVideoHandler;
    this.hasAudio = false;
    this.hasAudioHandler = hasAudioHandler;
    this.countHandler = countHandler;
    this.socket = socket;
    this.failed = false;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.producerTransport = null;
    this.consumerTransport = null;
    this.producers = [];
    this.device = null;
    this._isOpen = false;
    this.deleteBroadcast = deleteBroadcast;
    this.initBroadcast(this.broadcastTitle, this.broadcastId, this.peerId);
  }

  initBroadcast = async (title, broadcastId, peerId) => {
    this.initSockets();
    const createResponse = await this.socket
      .request("createBroadcast", {
        title,
        broadcastId,
        token: this.accessToken,
        refreshToken: this.refreshToken,
      })
      .catch((err) => this.requestFail("createBroadcast"));
    console.log("createResponse", createResponse);
    if (this.failed) return;

    // const routerRtpCapabilities = await this.socket
    //   .request("getRouterRtpCapabilities", { broadcastId, peerId })
    //   .catch((err) => {
    //     this.requestFail("getRouterRtpCapabilities");
    //   });
    // if (this.failed) return;
    // else console.log("routerRtpCapabilities", routerRtpCapabilities);

    const device = await this.createDevice(
      createResponse.RouterRtpCapabilities
    );
    this.device = device;

    const initRes = await this.initSendTransports(
      peerId,
      device,
      createResponse.WebRtcTransport
    );
    if (!initRes) {
      console.log("Failed to create the transport");
      return;
    }

    this._isOpen = true;

    if (this.audioInput) {
      await this.produce(mediaTypes.audio);
    }
    if (this.videoInput) {
      await this.produce(mediaTypes.video);
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

  initSendTransports = async (peerId, device, data) => {
    // const data = await this.socket
    //   .request("createWebRtcTransport", {
    //     peerId,
    //     isStreamer,
    //   })
    //   .catch((err) => {
    //     this.requestFail("createWebRtcTransport");
    // });
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
          console.log("Producer Transport ID:", this.producerTransport.id);
          const data = await this.socket.request("produce", {
            producerWebRtcTransportId: this.producerTransport.id,
            kind,
            rtpParameters,
            peerId,
          });
          callback({ id: data.ProducerId });
        } catch (err) {
          errback(err);
          this.requestFail("produce");
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

  initRecvTransports = async (peerId, device, isStreamer) => {
    const data = await this.socket
      .request("createWebRtcTransport", {
        peerId,
        isStreamer,
      })
      .catch((err) => {
        this.requestFail("createWebRtcTransport");
      });

    this.consumerTransport = device.createRecvTransport(data);
    console.log("consumer recieve transport created.");

    const requestFail = this.requestFail;
    this.consumerTransport.on(
      "connect",
      async function ({ dtlsParameters }, callback, errBack) {
        try {
          await this.socket.request("connectTransport", {
            dtlsParameters,
            transportId: data.id,
            peerId: this.peerId,
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

  async produce(type) {
    console.log("calling produce() function for producing", type);
    let mediaConstraints = {};
    const w = window.innerWidth;
    const h = window.innerHeight;
    const screenType = w > h ? "laptop" : "phone";
    // const videoConstraints =
    //   screenType === "laptop"
    //     ? {
    //         height: { min: 540, ideal: 720, max: 1080 },
    //         width: { min: 960, ideal: 1280, max: 1920 },
    //       }
    //     : {
    //         width: { min: 540, ideal: 720, max: 1080 },
    //         height: { min: 960, ideal: 1280, max: 1920 },
    //       };
    console.log(w, h);
    console.log("type:", type);
    switch (type) {
      case mediaTypes.audio:
        mediaConstraints = {
          audio: true,
          video: false,
        };
        break;
      case mediaTypes.video:
        mediaConstraints = {
          audio: false,
          video: {
            // width: w,
            // height: h,
            // ...videoConstraints,
            facingMode: "user",
          },
        };
        break;
      default:
        return;
    }
    console.log("mediaConstraints:", mediaConstraints);
    if (!this.device.canProduce("video") && type === mediaTypes.video) {
      console.error("cannot produce video");
      return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      const track =
        type === mediaTypes.audio
          ? stream.getAudioTracks()[0]
          : stream.getVideoTracks()[0];
      const params = {
        track,
      };
      if (type === mediaTypes.video) {
        params.encodings = [
          {
            rid: "r0",
            maxBitrate: 100000,
            //scaleResolutionDownBy: 10.0,
            scalabilityMode: "S1T3",
          },
          {
            rid: "r1",
            maxBitrate: 300000,
            scalabilityMode: "S1T3",
          },
          {
            rid: "r2",
            maxBitrate: 900000,
            scalabilityMode: "S1T3",
          },
        ];
        params.codecOptions = {
          videoGoogleStartBitrate: 1000,
        };
      }
      const producer = await this.producerTransport.produce(params);
      console.log("produce method succeeded:", producer);
      this.producers.push({
        id: producer.id,
        producer,
        kind: producer.kind,
      });
      console.log("new producers array: ", this.producers);

      if (type === mediaTypes.video) {
        this.hasVideo = true;
        this.hasVideoHandler(this.hasVideo);
      } else if (type === mediaTypes.audio) {
        this.hasAudio = true;
        this.hasAudioHandler(true);
      }

      let elem;
      console.log("prodcer Type:", type);
      if (type === mediaTypes.video) {
        elem = document.querySelector(".video-react-video");
        console.log('elem: ', elem);
        elem.srcObject = stream;
        elem.id = producer.id;
        elem.playsinline = false;
        elem.autoplay = true;
        elem.className = "vid";
      }

      producer.on("trackended", () => {
        this.closeProducer(type);
      });

      producer.on("transportclose", () => {
        console.log("producer transport close");
        if (type === mediaTypes.video) {
          elem.srcObject.getTracks().forEach(function (track) {
            track.stop();
          });
          elem.parentNode.removeChild(elem);
        }
        this.producers.delete(producer.id);
      });

      producer.on("close", () => {
        console.log("closing producer");
        if (type === mediaTypes.video) {
          elem.srcObject.getTracks().forEach(function (track) {
            track.stop();
          });
          elem.parentNode.removeChild(elem);
        }
        this.producers.delete(producer.id);
      });
    } catch (err) {
      console.log(err);
    }
  }

  initSockets = () => {
    this.socket.on("consumerClosed", (consumer_id) => {
      console.log("closing consumer:", consumer_id);
      this.removeConsumer(consumer_id);
    });

    this.socket.on("participantsCount", (count) => {
      console.log("new Count:", count);
      this.countHandler(count);
    });
    const exitFunc = this.exit;
    this.socket.on("disconnect", () => {
      exitFunc(true);
    });
  };

  pauseProducer = async (type) => {
    console.log("oooooh jeeeeeeeeeeeeeeeeeeez");
    let producer = this.producers.find((producer) => producer.kind === type);
    const pauseResponse = await this.socket.request("pauseProducer", {
      producerId: producer.id,
    });
    console.log("pauseResponse", pauseResponse);

    // if (pauseResponse) {
    if (type === mediaTypes.video) {
      this.hasVideo = false;
      this.hasVideoHandler(this.hasVideo);
    } else if (type === mediaTypes.audio) {
      this.hasAudio = false;
      this.hasAudioHandler(false);
    }
    console.log(
      `Pausing producer with type of: ${producer.kind} id of:`,
      producer.id
    );
    producer.producer.pause();

    if (type === mediaTypes.video) {
      let elem = document.getElementById(producer.id);
      elem.pause();
    }
    // }
  };

  resumeProducer = async (type) => {
    let producer = this.producers.find((producer) => producer.kind === type);
    const resumeResponse = await this.socket.request("resumeProducer", {
      producerId: producer.id,
    });

    // if (resumeResponse) {
    console.log(
      `Pausing producer with type of: ${producer.kind} id of:`,
      producer.id
    );
    producer.producer.resume();

    if (type === mediaTypes.video) {
      let elem = document.getElementById(producer.id);
      elem.play();
    }

    if (type === mediaTypes.video) {
      this.hasVideo = true;
      this.hasVideoHandler(this.hasVideo);
    } else if (type === mediaTypes.audio) {
      this.hasAudio = true;
      this.hasAudioHandler(true);
    }
    // }
  };

  closeProducer = (type) => {
    let producer = this.producers.find((producer) => producer.kind === type);
    if (type === mediaTypes.video) {
      this.hasVideo = false;
      this.hasVideoHandler(this.hasVideo);
    }
    console.log(
      `closing producer with type of: ${producer.kind} id of:`,
      producer.id
    );
    producer.producer.close();
    this.socket.emit("producerClosed", {
      producerId: producer.id,
    });
    this.producers.splice(
      this.producers.findIndex((p) => p.id === producer.id),
      1
    );
    console.log("new producers array: ", this.producers);

    if (type === mediaTypes.video) {
      let elem = document.getElementById(producer.id);
      elem.srcObject.getTracks().forEach(function (track) {
        track.stop();
      });
      elem.parentNode.removeChild(elem);
    }
  };

  async exit(offline = false) {
    if (!offline) {
      const exitBroadcastResponse = await this.socket.request("exitBroadcast", {
        broadcastId: this.broadcastId,
        peerId: this.peerId,
        isStreamer: this.isStreamer,
      });
      console.log("exitRoomResponse: ", exitBroadcastResponse);
      this.clean();
    } else {
      this.clean();
    }
  }

  requestFail(req) {
    console.log(`${req} method failed`);
    errorToast("مشکلی از سمت سرور پیش آمده");
    this.failed = true;
    this.deleteBroadcast();
  }

  clean = () => {
    this._isOpen = false;
    if (this.consumerTransport) {
      this.consumerTransport.close();
    }
    if (this.producerTransport) {
      this.producerTransport.close();
    }
    this.socket.socket.off("disconnect");
    this.socket.socket.off("getProducers");
    this.socket.socket.off("consumerClosed");
    this.deleteBroadcast();
  };
  isOpen() {
    return this._isOpen;
  }
}
