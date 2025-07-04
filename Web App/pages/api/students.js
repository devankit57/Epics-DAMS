import { connectToDatabase } from '../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const student = req.body; // Expecting a single object, not an array

    // Validate the required fields
    if (
      !student.name ||
      !student.className ||
      !student.fatherName ||
      !student.mobile ||
      !student.address
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Sanitize data (trim whitespace)
    student.name = student.name.trim();
    student.className = student.className.trim();
    student.fatherName = student.fatherName.trim();
    student.mobile = student.mobile.trim();
    student.address = student.address.trim();

    // Check for duplicate (based on class and mobile)
    const existing = await db
      .collection('students')
      .findOne({ className: student.className, mobile: student.mobile });

    if (existing) {
      return res.status(409).json({ message: 'Student already exists' });
    }

    // Assign roll number based on class count
    const rollCount = await db
      .collection('students')
      .countDocuments({ className: student.className });

    student.rollNo = rollCount + 1; // Auto-generate roll number

    // Insert student
    const result = await db.collection('students').insertOne(student);

    return res.status(201).json({ ...student, _id: result.insertedId });

  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
