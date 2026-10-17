const InterviewRequest = require('../models/InterviewRequest');
const Job = require('../models/Job');
const Payment = require('../models/Payment');
const { requestInterviewAssistance } = require('../services/interviewService');
const { sendMockInterviewConfirmationEmail } = require('../services/emailService');

/**
 * Submit Interview Assistance Request
 */
const requestInterview = async (req, res, next) => {
  try {
    const { jobId, paymentId, notes } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    // Verify payment if provided
    let verifiedPayment = null;
    if (paymentId) {
      verifiedPayment = await Payment.findOne({
        _id: paymentId,
        user: req.user._id,
        serviceType: 'interview_assistance',
      });
    }

    const request = await requestInterviewAssistance({
      candidateId: req.user._id,
      jobId,
      paymentId: verifiedPayment ? verifiedPayment._id : null,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: 'Interview assistance request submitted. Our team will coordinate scheduling with the employer.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get candidate's interview requests
 */
const getMyInterviews = async (req, res, next) => {
  try {
    const interviews = await InterviewRequest.find({ candidate: req.user._id })
      .populate('job')
      .populate('payment')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get interview request by ID
 */
const getInterviewById = async (req, res, next) => {
  try {
    const interview = await InterviewRequest.findOne({
      _id: req.params.id,
      candidate: req.user._id,
    })
      .populate('job')
      .populate('payment');

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview request not found' });
    }

    return res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Schedule Practice Mock Interview for ₹100 (IT & Non-IT Every Domain)
 */
const schedulePracticeInterview = async (req, res, next) => {
  try {
    const {
      domain = 'IT & Software',
      role = 'Frontend Developer',
      date = 'Tomorrow',
      timeSlot = '11:00 AM - 11:45 AM',
      interviewType = '1-on-1 Practice Mock Interview',
      candidateName,
      candidateEmail,
      candidatePhone,
      utrNumber,
    } = req.body;

    const bookingId = `GJ-PRAC-${Date.now().toString().slice(-6)}`;
    const meetLink = 'https://meet.google.com/tvh-fkug-taj';

    const candidateEmailAddress = candidateEmail || req.user?.email || 'dk9974796@gmail.com';
    const candidateFullName = candidateName || req.user?.name || 'Candidate';

    const booking = {
      bookingId,
      domain,
      role,
      date,
      timeSlot,
      fee: 100,
      currency: 'INR',
      status: 'CONFIRMED',
      meetLink,
      candidateName: candidateFullName,
      candidateEmail: candidateEmailAddress,
      candidatePhone: candidatePhone || req.user?.phone || '',
      utrNumber: utrNumber || `UTR${Date.now()}`,
      bookedAt: new Date(),
    };

    // Dispatch confirmation email to candidate with Google Meet link and time details
    try {
      await sendMockInterviewConfirmationEmail({
        candidateName: candidateFullName,
        candidateEmail: candidateEmailAddress,
        domain,
        role,
        date,
        timeSlot,
        meetLink,
        bookingId,
        utrNumber: booking.utrNumber,
      });
      console.log(`[Interview Controller] Mock interview confirmation email dispatched to ${candidateEmailAddress}`);
    } catch (emailErr) {
      console.warn(`[Interview Controller Email Warning]: ${emailErr.message}`);
    }

    return res.status(201).json({
      success: true,
      message: `Practice mock interview session scheduled successfully for ₹100! Confirmation email with Google Meet link has been sent to ${candidateEmailAddress}.`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get tailored interview questions & model answers for IT and Non-IT domains
 */
const getDomainQuestions = (req, res) => {
  const { domain = 'IT' } = req.query;

  const questionsBank = {
    'IT': [
      {
        question: 'Explain the Virtual DOM in React and how the reconciliation diffing algorithm works.',
        type: 'Technical',
        answer: 'Virtual DOM is a lightweight JavaScript object representation of the real DOM. When state changes, React creates a new VDOM tree and compares it with the previous one (reconciliation). It calculates the minimal set of real DOM mutations needed, batching updates for high performance.',
        keyPoints: ['In-memory representation', 'Batch DOM updates', 'O(n) heuristic diffing'],
      },
      {
        question: 'What is the difference between SQL and NoSQL databases, and when would you choose MongoDB?',
        type: 'Technical',
        answer: 'SQL databases are relational, table-based with strict schemas, ideal for complex transactional queries (ACID). NoSQL like MongoDB is document-oriented (JSON/BSON), schema-flexible, and horizontally scalable, ideal for rapid product iterations, unstructured payloads, and hierarchical data.',
        keyPoints: ['Structured vs Flexible Schema', 'ACID vs BASE', 'Horizontal scalability'],
      },
      {
        question: 'How do you handle asynchronous operations and error catching in Node.js?',
        type: 'Technical',
        answer: 'Using modern async/await syntax paired with try/catch blocks, alongside central Express error-handling middleware. For unhandled rejections, monitoring process.on("unhandledRejection") ensures resilience.',
        keyPoints: ['Async/Await', 'Centralized Error Middleware', 'Promise handling'],
      },
      {
        question: 'Describe a challenging bug you diagnosed and resolved under time pressure.',
        type: 'Behavioral / HR',
        answer: 'Describe the situation systematically: state the problem context, how you reproduced it using logs/devtools, isolated the root cause, implemented a clean test-covered fix, and deployed without regressions.',
        keyPoints: ['STAR Method', 'Root Cause Analysis', 'Effective Communication'],
      },
    ],
    'Non-IT': [
      {
        question: 'How do you handle an escalated or angry customer in Customer Support / Operations?',
        type: 'Scenario / Behavioral',
        answer: 'Follow the HEAT model: Hear them out without interrupting, Empathize with their inconvenience, Apologize sincerely for the disruption, and Take immediate ownership with clear step-by-step resolution timelines.',
        keyPoints: ['Active Listening', 'De-escalation', 'First Contact Resolution (FCR)'],
      },
      {
        question: 'How do you overcome budget and price objections during a B2B sales pitch?',
        type: 'Sales Technique',
        answer: 'Acknowledge the budget constraint first, then pivot from upfront cost to long-term ROI and productivity gains. Provide customer case studies demonstrating payback period and offer tailored phased adoption.',
        keyPoints: ['Value Proposition', 'ROI Justification', 'Objection Handling'],
      },
      {
        question: 'How do you balance high volume hiring while maintaining quality talent benchmarks in HR?',
        type: 'HR / Recruitment',
        answer: 'Implement structured screening rubrics, leverage partner job syndication feeds (LinkedIn/Naukri), conduct preliminary skill assessments, and maintain a proactive candidate pipeline.',
        keyPoints: ['Structured Rubrics', 'Pipeline Management', 'Quality vs Speed'],
      },
      {
        question: 'Why do you want to join our organization and what makes you a strong candidate?',
        type: 'HR / General',
        answer: 'Connect personal skills and past achievements directly to company goals. Highlight adaptability, domain experience, and readiness to deliver measurable outcomes from day one.',
        keyPoints: ['Company Research', 'Self-Awareness', 'Long-term Alignment'],
      },
    ],
  };

  const domainKey = domain.toLowerCase().includes('it') && !domain.toLowerCase().includes('non') ? 'IT' : 'Non-IT';

  return res.status(200).json({
    success: true,
    domain: domainKey,
    questions: questionsBank[domainKey] || questionsBank['IT'],
  });
};

module.exports = {
  requestInterview,
  getMyInterviews,
  getInterviewById,
  schedulePracticeInterview,
  getDomainQuestions,
};

