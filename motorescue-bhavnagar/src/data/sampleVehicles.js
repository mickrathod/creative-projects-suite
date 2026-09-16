export const SAMPLE_VEHICLES = {
  'GJ-04-AB-1234': {
    regNo: 'GJ-04-AB-1234',
    owner: 'Priyank Trivedi',
    locality: 'Kaliyabid, Bhavnagar',
    model: 'Honda Activa 6G (Matte Axis Grey)',
    lastServiceDate: '2026-08-24',
    odometerKm: 14820,
    nextDueKm: 17800,
    nextDueDate: '2026-11-24',
    warrantyActive: true,
    warrantyDaysLeft: 68,
    records: [
      {
        id: 'REC-8821',
        date: '2026-08-24',
        type: 'Doorstep Routine Service',
        package: 'Express Lube & 18-Point Check',
        mechanic: 'Ramesh Vaghela (Master Tech)',
        totalBill: 729,
        items: [
          { name: 'Doorstep Service Labour', cost: 299 },
          { name: 'Castrol Activ 10W-30 (800ml Sealed)', cost: 380 },
          { name: 'Sump Washer & Spark Plug Clean', cost: 50 }
        ],
        inspections: {
          engineOil: 'Freshly Replaced (Castrol 10W-30)',
          frontBrake: 'Good (80% remaining)',
          rearBrake: 'Adjusted & Dust Cleaned',
          battery: '12.6V - Healthy',
          tyreTread: 'Front 3.2mm, Rear 2.9mm - OK'
        },
        warrantyUntil: '2026-11-24'
      },
      {
        id: 'REC-6410',
        date: '2026-04-12',
        type: 'Emergency Roadside Assistance',
        package: 'Tubeless Puncture Fix & Pressure Top-up',
        mechanic: 'Haresh Solanki',
        totalBill: 149,
        items: [
          { name: 'Roadside Tubeless Strip Plug (Rear Tyre)', cost: 149 }
        ],
        inspections: {
          tyreTread: 'Air holding at 34 PSI'
        },
        warrantyUntil: '2026-05-12'
      }
    ]
  },
  'GJ-04-DE-5678': {
    regNo: 'GJ-04-DE-5678',
    owner: 'Bhargav Mehta',
    locality: 'Waghawadi Road, Bhavnagar',
    model: 'Hero Splendor Plus (Black with Silver)',
    lastServiceDate: '2026-07-15',
    odometerKm: 28450,
    nextDueKm: 31450,
    nextDueDate: '2026-10-15',
    warrantyActive: true,
    warrantyDaysLeft: 29,
    records: [
      {
        id: 'REC-7734',
        date: '2026-07-15',
        type: 'Doorstep Routine Service',
        package: 'Comprehensive Care & Full Tune-Up',
        mechanic: 'Paresh Parmar',
        totalBill: 1049,
        items: [
          { name: 'Comprehensive Service Labour', cost: 499 },
          { name: 'Motul 4T Plus 20W-40 (900ml)', cost: 360 },
          { name: 'OEM Drive Chain Sprocket Lube', cost: 90 },
          { name: 'OEM Air Filter Element', cost: 100 }
        ],
        inspections: {
          engineOil: 'Fresh Motul 20W-40',
          frontBrake: 'Re-aligned',
          rearBrake: 'New OEM brake shoes fitted',
          battery: '12.4V - Adequate',
          tyreTread: 'Adequate'
        },
        warrantyUntil: '2026-10-15'
      }
    ]
  },
  'GJ-04-KL-9012': {
    regNo: 'GJ-04-KL-9012',
    owner: 'Jaydeep Gohil',
    locality: 'Sardarnagar, Bhavnagar',
    model: 'Royal Enfield Classic 350 (Dark Stealth)',
    lastServiceDate: '2026-09-02',
    odometerKm: 18300,
    nextDueKm: 21300,
    nextDueDate: '2026-12-02',
    warrantyActive: true,
    warrantyDaysLeft: 78,
    records: [
      {
        id: 'REC-9102',
        date: '2026-09-02',
        type: 'Emergency Night Breakdown (11:15 PM)',
        package: 'Dead Battery Jumpstart & Diagnostic',
        mechanic: 'Haresh Solanki',
        totalBill: 349,
        items: [
          { name: 'Night Emergency Call-Out & Booster Jump', cost: 349 }
        ],
        inspections: {
          battery: 'Weak resting voltage (11.8V). Recommended replacement before winter.'
        },
        warrantyUntil: '2026-10-02'
      }
    ]
  }
};
