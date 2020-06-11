class RoomGen {
  constructor() {
    this.roomAmount = 200;
    this.tileSize = 16;

    this.mapHeight = 2560;
    this.mapWidth = 5120;
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

  checkRoomOverlap(room1, rooms) {
    for (let room2 of rooms) {
      if (
        room1.startTileX < room2.startTileX + room2.width &&
        room1.startTileX + room1.width > room2.startTileX &&
        room1.startTileY < room2.startTileY + room2.height &&
        room1.startTileY + room1.height > room2.startTileY
      ) {
        return true;
      }
    }
    return false;
  }

  generateRandomRoom(randPos, prevRoom, roomWidth, roomHeight) {
    let randomRoom = null;
    if (randPos == 0) {
      // place a room to the right of previous
      randomRoom = {
        startTileX: prevRoom.startTileX + prevRoom.width,
        startTileY: Math.round(
          prevRoom.startTileY +
            (Math.random() * (prevRoom.height - roomHeight)) %
              (prevRoom.height - 2)
        ),
        width: roomWidth,
        height: roomHeight,
        icon: botbIcon.random16icon()
      };
    } else if (randPos == 1) {
      // place a room below previous
      randomRoom = {
        startTileX: Math.round(
          prevRoom.startTileX +
            (Math.random() * (prevRoom.width - roomWidth)) %
              (prevRoom.width - 2)
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
        startTileY: Math.round(
          prevRoom.startTileY +
            (Math.random() * (prevRoom.height - roomHeight)) %
              (prevRoom.height - 2)
        ),
        width: roomWidth,
        height: roomHeight,
        icon: botbIcon.random16icon()
      };
    } else {
      // place a room above previous
      randomRoom = {
        startTileX: Math.round(
          prevRoom.startTileX +
            (Math.random() * (prevRoom.width - roomWidth)) %
              (prevRoom.width - 2)
        ),
        startTileY: prevRoom.startTileY - roomHeight,
        width: roomWidth,
        height: roomHeight,
        icon: botbIcon.random16icon()
      };
    }
    return randomRoom;
  }

  generate() {
    let rooms = [
      {
        startTileX: 145,
        startTileY: 60,
        width: 25,
        height: 25,
        icon: botbIcon.random16icon()
      }
    ];

    let overlap = false;

    for (let roomIndex = 0; roomIndex < this.roomAmount; roomIndex++) {
      //let prevRoom = rooms[rooms.length - 1];
      let prevRoom = rooms[this.randint(0, rooms.length - 1)];

      let randPos = Math.round(Math.random() * 3);
      //let randPos = 1;

      let roomWidth = Math.round(Math.random() * 16) + 4;
      let roomHeight = Math.round(Math.random() * 16) + 4;

      let randomRoom = this.generateRandomRoom(
        randPos,
        prevRoom,
        roomWidth,
        roomHeight
      );

      overlap = false;

      if (this.checkRoomOverlap(randomRoom, rooms)) {
        overlap = true;
        for (let position = 0; position < 4; position++) {
          //roomWidth = Math.round(Math.random() * 16) + 2;
          //roomHeight = Math.round(Math.random() * 16) + 2;

          randomRoom = this.generateRandomRoom(
            position,
            prevRoom,
            roomWidth,
            roomHeight
          );

          if (!this.checkRoomOverlap(prevRoom, rooms)) {
            overlap = false;
            break;
          }
        }
      }

      // ignore any rooms which go out of the map bounds
      if (
        (randomRoom.startTileY + randomRoom.height + 1) * this.tileSize >
          this.mapHeight ||
        randomRoom.startTileY * this.tileSize < 0 ||
        (randomRoom.startTileX + randomRoom.width + 1) * this.tileSize >
          this.mapWidth ||
        randomRoom.startTileX * this.tileSize < 0
      ) {
        overlap = true;
      }

      if (!overlap) {
        rooms.push(randomRoom);
      }
    }

    return rooms;
  }
}

var roomgen = new RoomGen();
