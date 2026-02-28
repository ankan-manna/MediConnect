# MediConnect MongoDB Document Schemas

## Databases
- `mediconnect_patient` – health timeline, remote monitoring
- `mediconnect_doctor` – prescriptions
- `mediconnect_lab` – lab reports

## Collections & Indexes

### patient.health_timeline
```javascript
{
  _id: ObjectId,
  patientUserId: Long,
  eventType: String,  // APPOINTMENT, PRESCRIPTION, LAB_REPORT, VITAL, MEDICATION
  eventDate: ISODate,
  title: String,
  description: String,
  metadata: Object,
  sourceService: String,
  referenceId: String
}
// Compound index: { patientUserId: 1, eventDate: -1 }
```

### patient.remote_monitoring
```javascript
{
  _id: ObjectId,
  patientUserId: Long,
  deviceType: String,  // BP_MONITOR, GLUCOSE, WEIGHT
  recordedAt: ISODate,
  readings: { systolic?: Number, diastolic?: Number, value?: Number },
  unit: String
}
// Compound index: { patientUserId: 1, recordedAt: -1 }
```

### doctor.prescriptions
```javascript
{
  _id: ObjectId,
  doctorUserId: Long,
  patientUserId: Long,
  appointmentId: Long,
  diagnosis: String,
  notes: String,
  items: [
    { medicineName: String, dosage: String, frequency: String, duration: String, instructions: String }
  ],
  createdAt: ISODate
}
// Compound index: { doctorUserId: 1, patientUserId: 1, createdAt: -1 }
```

### lab.lab_reports
```javascript
{
  _id: ObjectId,
  patientUserId: Long,
  bookingId: Long,
  testName: String,
  testCode: String,
  reportDate: ISODate,
  reportUrl: String,
  values: [
    { parameterName: String, value: String, unit: String, referenceRange: String, abnormal: Boolean }
  ],
  hasAbnormalValues: Boolean,
  uploadedBy: String,
  createdAt: ISODate
}
// Compound index: { patientUserId: 1, createdAt: -1 }
```

## Sample Index Creation (MongoShell)
```javascript
db.health_timeline.createIndex({ patientUserId: 1, eventDate: -1 });
db.remote_monitoring.createIndex({ patientUserId: 1, recordedAt: -1 });
db.prescriptions.createIndex({ doctorUserId: 1, patientUserId: 1, createdAt: -1 });
db.lab_reports.createIndex({ patientUserId: 1, createdAt: -1 });
```
