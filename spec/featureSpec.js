describe('world', () => {

  let world;

  beforeEach(() => {
    world = new World({
      map: undefined
    });
  });

  it('world to generate person who moves towards destination', () => {
    world.generatePerson();
    expect(world.people.length).toEqual(1);
    let originalLocation = world.people[0].location
    world.tick()
    expect(world.people[0].location.at(originalLocation)).toEqual(false);
    for (var i = 0; i < 110; i++) {
      world.tick();
    }
    expect(world.people.length).toEqual(0);
  });

  it('person arrives at destination before disappearing', () => {
    options = {
      location: new Location(0, 0),
      destination: new Location(0.5, 0),
      speed: 0.2,
    }
    world.generatePerson(options);

    world.tick();
    expect(world.people.length).toEqual(1); // at 0.2

    world.tick();
    expect(world.people.length).toEqual(1); // at 0.4

    world.tick();
    expect(world.people.length).toEqual(1); // at 0.5

    world.tick();
    expect(world.people.length).toEqual(1); // still at 0.5?

    world.tick();
    expect(world.people.length).toEqual(0); // still at 0.5?
  });


  it('person on vehicle goes to docking station closest to destination and walks', () => {
    world = new World({
      map: undefined
    });

    personOptions = {
      location: new Location(0, 0.5),
      path: [new Location(0, 1)],
      destination: new Location(0, 1),
    }
    let person = world.generatePerson(personOptions)
    person.vehicle = new Scooter

    dockingStationOptions = {
      location: new Location(0.01, 0.7)
    }
    let dockingStation = world.generateDockingStation(dockingStationOptions)
    let scootCounter = 0
    expect(world.dockingStations[0].location.x).toEqual(0.01)
    expect(world.dockingStations[0].location.y).toEqual(0.7)

    while (scootCounter < 2000) {
      world.tick();
      scootCounter++
      if (person.location.at(dockingStation.location)) {
        break;
      }
    }
    expect(scootCounter).toBeLessThan(8)
    expect(world.dockingStations[0].location.x).toEqual(0.01)
    expect(world.dockingStations[0].location.y).toEqual(0.7)

    let walkCounter = 0
    while (walkCounter < 2000) {
      world.tick();
      walkCounter++
      // console.log(walkCounter)

      // expect(world.dockingStations[0].location).toEqual([0.01, 0.7])

      if (person.location.at(new Location(0, 1))) {
        break;
      }
    }
    expect(walkCounter).toBeGreaterThan(10)
    expect(world.dockingStations[0].location.at(new Location(0.01, 0.7))).toEqual(true)

  });


  it('person will use a scooter when it goes past a docking station, and will put it back at the end', () => {
    let dockingStation1 = world.generateDockingStation({
      location: new Location(0, 0.6)
    })
    let dockingStation2 = world.generateDockingStation({
      location: new Location(0, 0.8)
    })

    expect(world.dockingStations.length).toEqual(2);

    let person = world.generatePerson({
      location: new Location(0, 0),
      destination: new Location(0, 1)
    });

    world.tick();
    world.tick();

    let stepCounter = 0

    while (stepCounter < 2000) {
      world.tick();
      stepCounter++
      if (person.location.at(dockingStation1.location)) {
        break;
      }
    }

    world.tick();
    world.tick();
    expect(person.onVehicle).toEqual(true)

    let scootCounter = 0
    while (scootCounter < 2000) {
      world.tick();
      scootCounter++
      if (person.location.at(dockingStation2.location)) {
        break;
      }
    }

    expect(scootCounter).toBeLessThan(8)
    expect(person.onVehicle).toEqual(false)
  });

  it('the balance of the world goes down by docking station cost when a docking station is purchased', () => {

    expect(world.balance).toEqual(100)
    world.generateDockingStation()
    expect(world.balance).toEqual(50)
  })


  it('the balance of the world goes down by docking station cost when a docking station is purchased', () => {
    expect(world.balance).toEqual(100)
    let dockingStation = world.generateDockingStation()
    dockingStation.dock(world)
    expect(world.balance).toEqual(55)
  })

  it('a person cant pick up a scooter from an empty docking station, so they wait by it', () => {
    let dockingStation1 = world.generateDockingStation({
      location: new Location(0, 0.6)
    })
    let dockingStation2 = world.generateDockingStation({
      location: new Location(0, 0.8)
    })


    let i
    for (i = 0; i < 6; i++) {
      world.generatePerson({
        location: new Location(0, 0),
        destination: new Location(0, 1)
      });
    }

    let j
    for (j = 0; j < 1000; j++) {
      world.tick();
    }

    expect(world.people.length).toEqual(1)
    expect(world.balance).toEqual(25)

  })


  it('a person cannot dock a scooter at a full docking station, so they wait by it', () => {
    let dockingStation1 = world.generateDockingStation({
      location: new Location(0, 0.6)
    })
    let dockingStation2 = world.generateDockingStation({
      location: new Location(0, 0.8),
      capacity: 4,
      dockedVehicles: 0
    })


    let i
    for (i = 0; i < 6; i++) {
      world.generatePerson({
        location: new Location(0, 0),
        destination: new Location(0, 1)
      });
    }

    let j
    for (j = 0; j < 1000; j++) {
      world.tick();
    }

    expect(world.people.length).toEqual(2)
    expect(world.balance).toEqual(20)

  })

  it('docking station capacity can be increased - 2 spaces at a time, one full and one empty, balance goes down', () => {
    let dockingStation1 = world.generateDockingStation({
      location: new Location(0, 0.6)
    })
    let dockingStation2 = world.generateDockingStation({
      location: new Location(0, 0.8),
      capacity: 4,
      dockedVehicles: 0
    })

    // console.log(dockingStation2.capacity + "OLD old CAPACITY")
    // console.log(dockingStation2.dockedVehicles + " old OLD DV")
    // console.log(world.balance + "old old balance ")
    let i
    for (i = 0; i < 6; i++) {
      world.generatePerson({
        location: new Location(0, 0),
        destination: new Location(0, 1),
      });
    }

    let j
    for (j = 0; j < 1000; j++) {
      world.tick();
    }
    expect(world.people.length).toEqual(2)
    expect(world.balance).toEqual(20)
    // console.log(dockingStation2.capacity + "OLD CAPACITY")
    // console.log(dockingStation2.dockedVehicles + "OLD DV")
    // console.log(world.balance + "old balance ")
    dockingStation2.increaseCapacity(world)
    // console.log(dockingStation2.capacity + "NEW CAPACITY")
    // console.log(dockingStation2.dockedVehicles + "NEW DV")
    // console.log(world.balance + "new balance ")
    expect(world.balance).toEqual(0)

    let h
    for (h = 0; h < 1000; h++) {
      world.tick();
    }
    expect(dockingStation2.capacity).toEqual(6)
    expect(dockingStation2.dockedVehicles).toEqual(6)
    expect(world.people.length).toEqual(1)
    expect(world.balance).toEqual(5)
  })

  //decrease capacity




  it('balance cannot be negative, a user cannot buy a docking station they cannot afford', () => {
    world.generateDockingStation()
    world.generateDockingStation()
    world.generateDockingStation()

    expect(world._dockingStations.length).toEqual(2)

  })

});