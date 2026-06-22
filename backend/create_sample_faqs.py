from app.database import SessionLocal, Base, engine
from app.models.faq_model import FAQ

# Create database tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

sample_faqs = [
    {
        "question": "How do I apply for leave?",
        "answer": "Log in to the Employee Portal → Leave Management → Apply Leave → Select leave type → Enter dates → Submit for manager approval.",
        "category": "Leave Management"
    },
    {
        "question": "How can I check my leave balance?",
        "answer": "Navigate to Employee Portal → Leave Management → Leave Balance to view your available leave.",
        "category": "Leave Management"
    },
    {
        "question": "Can I cancel my leave request?",
        "answer": "Go to Leave History → Select the leave request → Click Cancel if it has not yet been approved.",
        "category": "Leave Management"
    },
    {
        "question": "How do I apply for work from home?",
        "answer": "Open Employee Portal → Work From Home → Submit a request with dates and reason → Wait for manager approval.",
        "category": "Leave Management"
    },
    {
        "question": "What is the annual leave entitlement?",
        "answer": "Employees receive annual leave according to the company's HR leave policy.",
        "category": "Leave Management"
    },
    {
        "question": "How do I mark my attendance?",
        "answer": "Log in to the Employee Portal and use the Check-In button during office hours.",
        "category": "Attendance"
    },
    {
        "question": "What should I do if I forgot to check in?",
        "answer": "Submit an attendance regularization request through the Attendance section.",
        "category": "Attendance"
    },
    {
        "question": "How do I regularize my attendance?",
        "answer": "Go to Attendance → Regularization → Select the date → Enter the reason → Submit for approval.",
        "category": "Attendance"
    },
    {
        "question": "When will my salary be credited?",
        "answer": "Salary is credited on the last working day of every month.",
        "category": "Payroll"
    },
    {
        "question": "How do I download my payslip?",
        "answer": "Navigate to Employee Portal → Payroll → Payslips → Select the month → Download PDF.",
        "category": "Payroll"
    },
    {
        "question": "Where can I download Form 16?",
        "answer": "Open Payroll → Tax Documents → Form 16 → Download.",
        "category": "Payroll"
    },
    {
        "question": "How do I update my bank account details?",
        "answer": "Go to My Profile → Bank Details → Update information → Submit for HR verification.",
        "category": "Payroll"
    },
    {
        "question": "How do I reset my password?",
        "answer": "Click Forgot Password on the login page, verify your identity using OTP, and create a new password.",
        "category": "Account"
    },
    {
        "question": "My account is locked. What should I do?",
        "answer": "Wait 30 minutes or contact the IT Helpdesk to unlock your account.",
        "category": "Account"
    },
    {
        "question": "How do I connect to the company VPN?",
        "answer": "Install the VPN client, enter the VPN server address, log in with company credentials, and complete multi-factor authentication.",
        "category": "VPN"
    },
    {
        "question": "VPN is not connecting. What should I do?",
        "answer": "Check your internet connection, restart the VPN client, verify your credentials, and contact IT if the issue continues.",
        "category": "VPN"
    },
    {
        "question": "How do I configure Outlook?",
        "answer": "Open Outlook → Add Account → Enter your company email address → Complete authentication.",
        "category": "Email"
    },
    {
        "question": "I cannot send emails. What should I do?",
        "answer": "Check your internet connection, mailbox storage, and SMTP settings. Contact IT if the problem persists.",
        "category": "Email"
    },
    {
        "question": "How do I request a new laptop?",
        "answer": "Submit an Asset Request through the Employee Portal and obtain manager approval.",
        "category": "Hardware"
    },
    {
        "question": "My laptop is running slowly.",
        "answer": "Restart the device, remove unnecessary files, install pending updates, and contact IT if performance remains poor.",
        "category": "Hardware"
    },
    {
        "question": "How do I request software installation?",
        "answer": "Create an IT ticket specifying the required software and business justification.",
        "category": "Hardware"
    },
    {
        "question": "How do I report an air conditioning issue?",
        "answer": "Create a Facilities ticket including your floor number, seat location, and issue description.",
        "category": "Facilities"
    },
    {
        "question": "How do I report a housekeeping issue?",
        "answer": "Submit a Facilities request with the location and details of the issue.",
        "category": "Facilities"
    },
    {
        "question": "How do I book a meeting room?",
        "answer": "Open the Meeting Room Booking portal, select the room, choose the date and time, and confirm the reservation.",
        "category": "Facilities"
    },
    {
        "question": "I lost my access card. What should I do?",
        "answer": "Immediately inform Security and raise a Facilities ticket to request a replacement access card.",
        "category": "Facilities"
    },
    {
        "question": "How do I update my personal information?",
        "answer": "Go to My Profile → Personal Information → Edit your details → Save changes.",
        "category": "Employee Information"
    },
    {
        "question": "How do I update my emergency contact details?",
        "answer": "Navigate to My Profile → Emergency Contacts → Update details → Save.",
        "category": "Employee Information"
    },
    {
        "question": "How do I enroll in the health insurance plan?",
        "answer": "Visit Employee Benefits → Health Insurance → Complete the enrollment form during the enrollment period.",
        "category": "Benefits"
    },
    {
        "question": "How do I submit a medical reimbursement claim?",
        "answer": "Open Benefits → Medical Claims → Upload receipts and supporting documents → Submit the claim.",
        "category": "Benefits"
    },
    {
        "question": "What documents are required for employee onboarding?",
        "answer": "Submit your government ID, address proof, educational certificates, bank details, and passport-size photographs.",
        "category": "Onboarding"
    },
    {
        "question": "How do I request an employee ID card?",
        "answer": "Complete the onboarding process and submit an ID card request through the HR portal.",
        "category": "Onboarding"
    },
    {
        "question": "How do I raise an IT support ticket?",
        "answer": "Log in to the Helpdesk Portal, click Create Ticket, select IT as the category, describe the issue, and submit.",
        "category": "IT Support"
    },
    {
        "question": "How can I check the status of my support ticket?",
        "answer": "Open My Tickets in the Helpdesk Portal to view the latest status and updates.",
        "category": "IT Support"
    }
]

try:
    for faq_data in sample_faqs:

        existing_faq = (
            db.query(FAQ)
            .filter(FAQ.question == faq_data["question"])
            .first()
        )

        if existing_faq:
            print(f"Already exists: {faq_data['question']}")
            continue

        faq = FAQ(
            question=faq_data["question"],
            answer=faq_data["answer"],
            category=faq_data["category"],
            status="active"
        )

        db.add(faq)
        print(f"Inserted: {faq_data['question']}")

    db.commit()
    print("All FAQs inserted successfully.")

except Exception as e:
    db.rollback()
    print(f"Error: {e}")

finally:
    db.close()