export class DexcomBgReading {
  constructor(public time: String, public magnitude: number) {}
}

export class DexcomBgReadings {
  constructor(public readings: DexcomBgReading[]) {}
}

export class DexcomKdcReadings {
  constructor(public values: number[]) {}
}
