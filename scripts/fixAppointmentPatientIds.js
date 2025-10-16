const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll need to set up your service account)
// This is a one-time script to fix the patient IDs in appointments

const fixAppointmentPatientIds = async () => {
  try {
    const firestore = admin.firestore();
    
    // Get all appointments with "current-user" patientId
    const appointmentsSnapshot = await firestore
      .collection('appointments')
      .where('patientId', '==', 'current-user')
      .get();
    
    console.log(`Found ${appointmentsSnapshot.docs.length} appointments to fix`);
    
    // Get a real patient ID (using the first patient we found)
    const patientsSnapshot = await firestore.collection('patients').limit(1).get();
    if (patientsSnapshot.empty) {
      console.log('No patients found in database');
      return;
    }
    
    const realPatient = patientsSnapshot.docs[0];
    const realPatientId = realPatient.id;
    const realPatientData = realPatient.data();
    
    console.log(`Using patient: ${realPatientData.name} (${realPatientId})`);
    
    // Update each appointment
    const batch = firestore.batch();
    
    appointmentsSnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        patientId: realPatientId,
        patientName: realPatientData.name,
        patientAge: realPatientData.age,
        patientGender: realPatientData.gender
      });
    });
    
    await batch.commit();
    console.log('Successfully updated all appointments!');
    
  } catch (error) {
    console.error('Error fixing appointments:', error);
  }
};

// Run this function once to fix the data
// fixAppointmentPatientIds();