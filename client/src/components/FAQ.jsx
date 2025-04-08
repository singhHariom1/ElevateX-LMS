import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  BookOpen,
  GraduationCap,
  CreditCard,
  Clock,
  Globe,
  HelpCircle,
} from "lucide-react";

const FAQItem = ({ question, answer, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={false}
      className="border-b border-gray-200 dark:border-gray-700"
    >
      <button
        className="flex w-full justify-between items-center text-left py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-lg px-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {question}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-6 flex-shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 px-4 text-gray-600 dark:text-gray-300">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = ({ faqs = defaultFaqs }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Find answers to common questions about our learning platform, courses,
          and how to get started.
        </p>
      </div>
      <div className="space-y-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            icon={faq.icon}
          />
        ))}
      </div>
    </div>
  );
};

// Default FAQ data tailored to your LMS
const defaultFaqs = [
  {
    question: "How do I enroll in a course?",
    answer:
      "To enroll in a course, simply browse our course catalog, select a course you're interested in, and click the 'Enroll' button. You'll need to be logged in to complete the enrollment process. Once enrolled, you can access the course content immediately.",
    icon: BookOpen,
  },
  {
    question: "What happens after I purchase a course?",
    answer:
      "After purchasing a course, you'll get immediate access to all course materials. You can track your progress in the 'My Learning' section, watch video lectures, and access course resources at your own pace. Your progress is automatically saved.",
    icon: GraduationCap,
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards and digital payment methods. All transactions are secure and encrypted. You'll receive a confirmation email with your purchase details and course access information.",
    icon: CreditCard,
  },
  {
    question: "How long do I have access to my courses?",
    answer:
      "You have lifetime access to any course you purchase. You can learn at your own pace and revisit the content as many times as you need. There are no time restrictions on course completion.",
    icon: Clock,
  },
  {
    question: "Can I access courses on mobile devices?",
    answer:
      "Yes! Our platform is fully responsive and works on all devices - desktop, tablet, and mobile. You can seamlessly switch between devices and continue learning from where you left off.",
    icon: Globe,
  },
  {
    question: "How do I get help if I have issues?",
    answer:
      "If you encounter any issues, you can reach out to our support team through the help center. We typically respond within 24 hours. For technical issues, you can also check our troubleshooting guides in the help section.",
    icon: HelpCircle,
  },
];

export default FAQ;
