export interface ComplaintClassificationResult {
  category: string;
  subcategory: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  priorityReason: string;
  department: string;
  summary: string;
  suggestedAction: string;
}

export function classifyComplaintAI(input: {
  title: string;
  description: string;
  location?: string;
}): ComplaintClassificationResult {
  const text = `${input.title} ${input.description} ${input.location || ''}`.toLowerCase();

  // 1. Critical safety / total outage checks
  if (
    text.includes('fire') ||
    text.includes('smoke') ||
    text.includes('shock') ||
    text.includes('blackout') ||
    text.includes('gas leak') ||
    text.includes('flooding') ||
    text.includes('emergency') ||
    text.includes('hazard')
  ) {
    return {
      category: 'Hostel',
      subcategory: 'Emergency / Safety',
      priority: 'CRITICAL',
      priorityReason: 'Selected CRITICAL priority because the issue involves an immediate physical safety or severe infrastructure outage requiring emergency response under 6 hours.',
      department: 'Estate & Facilities',
      summary: `Critical emergency reported: "${input.title}". Immediate facility dispatch initiated.`,
      suggestedAction: 'Immediate notification dispatched to Campus Safety and Facilities Rapid Response Team.',
    };
  }

  // 2. Wi-Fi / Internet / IT issues
  if (
    text.includes('wi-fi') ||
    text.includes('wifi') ||
    text.includes('internet') ||
    text.includes('network') ||
    text.includes('router') ||
    text.includes('lan') ||
    text.includes('ethernet') ||
    text.includes('lms') ||
    text.includes('portal')
  ) {
    const isHostel = text.includes('hostel') || text.includes('block') || text.includes('room');
    return {
      category: isHostel ? 'Hostel' : 'IT / Internet',
      subcategory: 'Internet / Wi-Fi Connectivity',
      priority: 'HIGH',
      priorityReason: 'Selected HIGH priority because network connectivity disruption directly impacts access to academic LMS materials, online assignments, and university services.',
      department: 'IT Services',
      summary: `Network connectivity failure reported at ${input.location || 'campus facility'}: "${input.title}".`,
      suggestedAction: 'Network Operations technician assigned for AP diagnostics and switch port verification.',
    };
  }

  // 3. Academic / Marks / Exams
  if (
    text.includes('marks') ||
    text.includes('exam') ||
    text.includes('grade') ||
    text.includes('transcript') ||
    text.includes('discrepancy') ||
    text.includes('score') ||
    text.includes('quiz') ||
    text.includes('hall ticket')
  ) {
    const isExam = text.includes('hall ticket') || text.includes('schedule') || text.includes('re-evaluation');
    return {
      category: isExam ? 'Examination' : 'Academic',
      subcategory: isExam ? 'Examination Administration' : 'Grade & Assessment Review',
      priority: isExam ? 'HIGH' : 'MEDIUM',
      priorityReason: isExam
        ? 'High priority due to proximity to official examination deadlines.'
        : 'Medium priority: Standard academic verification required with course instructor and department ledger.',
      department: isExam ? 'Examination Cell' : 'Academic Affairs',
      summary: `Academic grievance regarding assessment/examination records: "${input.title}".`,
      suggestedAction: 'Ticket queued for Course Faculty verification and Examination Controller records audit.',
    };
  }

  // 4. Transport
  if (
    text.includes('bus') ||
    text.includes('shuttle') ||
    text.includes('transport') ||
    text.includes('route') ||
    text.includes('driver')
  ) {
    return {
      category: 'Transport',
      subcategory: 'Campus Shuttle Transit',
      priority: 'HIGH',
      priorityReason: 'High priority because bus timing or route failures directly induce student attendance delays and safety risks.',
      department: 'Campus Transport',
      summary: `Campus transport schedule or operational failure reported: "${input.title}".`,
      suggestedAction: 'Forwarded to Transport In-Charge for fleet route tracking and driver shift inspection.',
    };
  }

  // 5. Infrastructure / Classroom AV / Projector / Water / AC
  if (
    text.includes('projector') ||
    text.includes('classroom') ||
    text.includes('speaker') ||
    text.includes('ac') ||
    text.includes('air condition') ||
    text.includes('water') ||
    text.includes('fan') ||
    text.includes('light') ||
    text.includes('bench') ||
    text.includes('desk')
  ) {
    return {
      category: 'Infrastructure & Maintenance',
      subcategory: text.includes('projector') || text.includes('speaker') ? 'Classroom AV Equipment' : 'Civil & Electrical Maintenance',
      priority: 'MEDIUM',
      priorityReason: 'Medium priority: Affects classroom or facility comfort, with alternative facilities available in the interim.',
      department: 'Estate & Facilities',
      summary: `Facility maintenance defect reported at ${input.location || 'campus premises'}: "${input.title}".`,
      suggestedAction: 'Work order generated for technician site inspection within 24 hours.',
    };
  }

  // 6. Library
  if (text.includes('library') || text.includes('book') || text.includes('journal') || text.includes('rfid')) {
    return {
      category: 'Library',
      subcategory: 'Library Services & Resources',
      priority: 'LOW',
      priorityReason: 'Low priority: Standard resource cataloging or facility inquiry with negligible academic disruption.',
      department: 'Central Library',
      summary: `Library resource request or minor maintenance inquiry: "${input.title}".`,
      suggestedAction: 'Logged with Chief Librarian desk for catalog and equipment follow-up.',
    };
  }

  // 7. General / Administration fallback
  return {
    category: 'Administration',
    subcategory: 'General Campus Services',
    priority: 'MEDIUM',
    priorityReason: 'Medium priority: General administrative query requiring departmental dispatch.',
    department: 'General Administration',
    summary: `Student submitted campus query: "${input.title}".`,
    suggestedAction: 'Routed to Central Campus Administrative Desk for review.',
  };
}
