drawHelpers = {
  person(canvas, person, size = 30) {
    let ctx = canvas.getContext("2d")
    ctx.fillStyle = "black";
    let offsetX = (person.location.x * canvas.width) - (size / 2)
    let offsetY = (person.location.y * canvas.height) - (size / 2)
    if (person.onVehicle()) {
      ctx.drawImage(onScooterIMG, offsetX, offsetY, size, size)
    } else {
      ctx.drawImage(walkingIMG, offsetX, offsetY, size, size)
    }
  },
  balance(canvas, balance) {
    let ctx = canvas.getContext("2d")
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillRect(540, 15, 100, 50)
    ctx.fillStyle = "black";
    ctx.font = '28px serif';
    ctx.fillText(`£ ${balance}`, 550, 50);
  },

  personPath(canvas, person) {
    console.log('pp')
    let ctx = canvas.getContext("2d")

    ctx.lineWidth = 1
    ctx.strokeStyle = `rgba(0,255,0,0.5)`
    ctx.beginPath();
    ctx.moveTo(person.location.x * canvas.width, person.location.y * canvas.height);
    ctx.lineTo(person.destination.x * canvas.width, person.destination.y * canvas.height);
    ctx.stroke();

    let fromX = person.location.x * canvas.width
    let fromY = person.location.y * canvas.height

    let pathNum = 1
    person.path.forEach((loc) => {
      let toX = loc.x * canvas.width
      let toY = loc.y * canvas.height

      ctx.strokeStyle = `rgba(255,0,0,${1/pathNum})`
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
      fromX = toX || fromX
      fromY = toY || fromY
    })

  },


  walkable(canvas, worldMap) {
    let ctx = canvas.getContext("2d")
    let drawX = worldMap.gridWidth * canvas.width
    let drawY = worldMap.gridHeight * canvas.height

    for (let x = 0; x < worldMap.width; x++) {
      for (let y = 0; y < worldMap.height; y++) {
        let gridLoc = {
          x: x,
          y: y
        }
        if (worldMap.isWalkable(gridLoc)) {
          ctx.fillStyle = 'rgb(0, 255, 0,0.5)'
        } else if (worldMap.isPathAdjacent(gridLoc)) {
          ctx.fillStyle = 'rgba(0, 255, 255, 0.5)'
        } else if (worldMap.isNotWalkable(gridLoc)) {
          ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
        }
        let offsetX = x * worldMap.gridWidth * canvas.width
        let offsetY = y * worldMap.gridHeight * canvas.height
        ctx.fillRect(offsetX, offsetY, drawX, drawY)
      }
    }
  },

  dsPlacement(canvas, worldMap) {
    let ctx = canvas.getContext("2d")
    let drawX = worldMap.gridWidth * canvas.width
    let drawY = worldMap.gridHeight * canvas.height
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)'

    for (let x = 0; x < worldMap.width; x++) {
      for (let y = 0; y < worldMap.height; y++) {
        let gridLoc = {
          x: x,
          y: y
        }
        if (worldMap.isNotWalkable(gridLoc) && worldMap.isPathAdjacent(gridLoc)) {
          let offsetX = x * worldMap.gridWidth * canvas.width
          let offsetY = y * worldMap.gridHeight * canvas.height
          ctx.fillRect(offsetX, offsetY, drawX, drawY)
        }
      }
    }
  }
}