class RoomGen {
  constructor() {
    this.roomAmount = 15;
  }
  generate() {
    let rooms = [
      {
        startTileX: 0,
        startTileY: 0,
        width: 25,
        height: 25,
        icon: botbIcon.random16icon()
      }
    ];

    for (let roomIndex = 0; roomIndex < this.roomAmount; roomIndex++) {
      // aoe
      let randomRoom = {
        startTileX: Math.round(64 - Math.random() * 128),
        startTileY: Math.round(64 - Math.random() * 128),
        width: Math.round(Math.random() * 32),
        height: Math.round(Math.random() * 32),
        icon: botbIcon.random16icon()
      };
      rooms.push(randomRoom);
    }

    return rooms;
  }
}

var roomgen = new RoomGen();
