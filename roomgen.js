class RoomGen {
  constructor() {
    this.roomAmount = 30;
  }

  // a test level for testing heheh
  test() {
    return [
      {
        startTileX: 0,
        startTileY: 0,
        width: 20,
        height: 20,
        icon: botbIcon.random16icon()
      },
      {
        startTileX: 20,
        startTileY: 10,
        width: 10,
        height: 40,
        icon: botbIcon.random16icon()
      },
      {
        startTileX: 30,
        startTileY: 10,
        width: 50,
        height: 5,
        icon: botbIcon.random16icon()
      },
      {
        startTileX: 0,
        startTileY: -10,
        width: 50,
        height: 10,
        icon: botbIcon.random16icon()
      },
      {
        startTileX: 50,
        startTileY: -10,
        width: 10,
        height: 30,
        icon: botbIcon.random16icon()
      },
      {
        startTileX: 20,
        startTileY: 0,
        width: 10,
        height: 10,
        icon: botbIcon.random16icon()
      }
    ];
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
