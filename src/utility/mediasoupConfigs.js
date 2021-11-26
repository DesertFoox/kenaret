export const serverURL = "https://mediasoup-server-dev.kenaret.com/";
// export const serverURL = "http://localhost:3030/";
// export const serverURL = "http://localhost:5000/";
export const mediaTypes = {
  audio: "audio",
  video: "video",
};
export const USER_TYPES = {
  streamer: "streamer",
  participant: "participant",
  none: "none",
};

export class MySocket {
  constructor(socket) {
    this.socket = socket;
  }

  request = async (type, data) => {
    return new Promise((resolve, reject) => {
      this.socket.emit(type, data, (res) => {
        if (res.Success) {
          resolve(res.Result);
        } else {
          console.log(`An Error Occured In ${type} Method`);
          reject(res.Error);
        }
      });
    });
  }

  emit(type, data) {
    return this.socket.emit(type, data);
  }

  async on(type, callBack) {
    return this.socket.on(type, (data) => {
      callBack(data);
    });
  }
}
