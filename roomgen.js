class RoomGen {
  constructor() {
    this.roomAmount = 5;
    this.tileSize = 16;
  }

  roundToTileSize(x) {
    return Math.round(x / this.tileSize) * this.tileSize;
  }

  randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
        startTileY: 20,
        width: 10,
        height: 10,
        icon: botbIcon.random16icon()
      },
      {
        startTileX: 50,
        startTileY: 0,
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

  checkRoomOverlap() {
    // todo
  }

  generate() {
    let rooms = [
      {
        startTileX: 80,
        startTileY: 60,
        width: 25,
        height: 25,
        icon: botbIcon.random16icon()
      }
    ];

    for (let roomIndex = 0; roomIndex < this.roomAmount; roomIndex++) {
      // aoe

      //let prevRoom = rooms[rooms.length - 1];
      let prevRoom = rooms[this.randint(0, rooms.length - 1)];

      let randPos = Math.round(Math.random() * 3);
      //let randPos = 1;
      let randomRoom = null;

      let roomWidth = Math.round(Math.random() * 16) + 2;
      let roomHeight = Math.round(Math.random() * 16) + 2;

      if (randPos == 0) {
        // place a room to the right of previous
        randomRoom = {
          startTileX: prevRoom.startTileX + prevRoom.width,
          startTileY: this.roundToTileSize(
            prevRoom.startTileY + (Math.random() * prevRoom.height - 5)
          ),
          width: roomWidth,
          height: roomHeight,
          icon: botbIcon.random16icon()
        };
      } else if (randPos == 1) {
        // place a room below previous
        randomRoom = {
          startTileX: this.roundToTileSize(
            prevRoom.startTileX + (Math.random() * prevRoom.width - 5)
          ),
          startTileY: prevRoom.startTileY + prevRoom.height,
          width: roomWidth,
          height: roomHeight,
          icon: botbIcon.random16icon()
        };
      } else if (randPos == 2) {
        // place a room to the left of previous
        randomRoom = {
          startTileX: prevRoom.startTileX - roomWidth,
          startTileY: this.roundToTileSize(
            prevRoom.startTileY + Math.random() * prevRoom.height - 5
          ),
          width: roomWidth,
          height: roomHeight,
          icon: botbIcon.random16icon()
        };
      } else {
        // place a room above previous
        randomRoom = {
          startTileX: this.roundToTileSize(
            prevRoom.startTileX + this.randint(0, prevRoom.width / 2)
          ),
          startTileY: prevRoom.startTileY - roomHeight,
          width: roomWidth,
          height: roomHeight,
          icon: botbIcon.random16icon()
        };
      }

      rooms.push(randomRoom);
    }

    return rooms;
  }
}

var roomgen = new RoomGen();
