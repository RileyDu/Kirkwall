import { 
    Box, 
    Heading, 
    Text, 
    List, 
    ListItem, 
    ListIcon, 
    Link, 
    useColorModeValue 
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const PrivacyPolicy = () => {
    const cardBg = useColorModeValue('gray.50', 'gray.800');
    const cardShadow = useColorModeValue('md', 'dark-lg');
    const sectionHeading = '#cee8ff'
    const listIconColor = useColorModeValue('teal.500', 'teal.200');

    return (
        <Box
            mx="auto"
            mt={4}
            mb={4}
            px={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            {/* Header */}
            <Heading mb={6} textAlign="center" size="2xl" fontWeight="bold">
                Privacy Policy
            </Heading>

            {/* Policy Content Container */}
            <Box
                bg={cardBg}
                borderRadius="20px"
                boxShadow={cardShadow}
                p={6}
                maxW="1200px"
                width="100%"
                overflowY="auto"
                maxHeight="80vh"
            >
                {/* Introduction */}
                <Text fontSize="lg" mb={4}>
                    Welcome to Kirkwall Defense Inc. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </Text>

                {/* Section 1 */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    1. What Information Do We Collect?
                </Heading>
                <Text mt={2}>
                    <strong>Personal Information Provided by You:</strong> Includes names, phone numbers, email addresses, mailing addresses, job titles, contact preferences, and billing addresses.
                </Text>
                <Text mt={2}>
                    <strong>Sensitive Information:</strong> We do not process sensitive information.
                </Text>
                <Text mt={2}>
                    <strong>Application Data:</strong> If you use our applications, we may collect information like push notifications preferences.
                </Text>
                <Text mt={2}>
                    <strong>Consent:</strong> Users must provide accurate information and update any changes.
                </Text>

                {/* Section 2 */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    2. How Do We Process Your Information?
                </Heading>
                <Text mt={2}>
                    <strong>Purpose:</strong> Information is processed to manage accounts, deliver services, respond to inquiries, send administrative updates, manage orders, and comply with legal obligations.
                </Text>
                <Text mt={2}>
                    <strong>Legal Basis:</strong> Processing is based on user consent, contractual necessity, legal requirements, and legitimate interests.
                </Text>

                {/* Section 3 */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    3. When and With Whom Do We Share Your Personal Information?
                </Heading>
                <Text mt={2}>
                    <strong>Business Transfers:</strong> Information may be shared during mergers, acquisitions, or sales.
                </Text>
                <Text mt={2}>
                    <strong>Third-Party Services:</strong> Sharing with service providers like Google Maps for API functionalities. View their <Link href="https://policies.google.com/privacy" color="teal.500" isExternal rel="noopener noreferrer">Privacy Policy</Link>.
                </Text>
                <Text mt={2}>
                    <strong>No Sale of Personal Information:</strong> The company does not sell or share personal data for commercial purposes.
                </Text>

                {/* Section 4 */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    4. Do We Use Cookies and Other Tracking Technologies?
                </Heading>
                <Text mt={2}>
                    We may use cookies, web beacons, and pixels for security, functionality, and advertising.
                </Text>
                <Text mt={2}>
                    <strong>Third-Party Tracking:</strong> Allows third parties to use tracking technologies for analytics and tailored advertising.
                </Text>
                <Text mt={2}>
                    <strong>Opt-Out:</strong> Users can manage cookie preferences through their browser settings.
                </Text>

                {/* Section 5 */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    5. Do We Offer Artificial Intelligence-Based Products?
                </Heading>
                <Text mt={2}>
                    <strong>AI Products:</strong> Provides AI-powered features through third-party providers like OpenAI. View their <Link href="https://openai.com/privacy" color="teal.500" isExternal rel="noopener noreferrer">Privacy Policy</Link>.
                </Text>
                <Text mt={2}>
                    <strong>Data Handling:</strong> Personal information is shared with AI service providers to facilitate AI functionalities.
                </Text>
                <Text mt={2}>
                    <strong>User Responsibility:</strong> Users must comply with AI service providers' terms and policies.
                </Text>

                {/* Section 6 */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    6. How Long Do We Keep Your Information?
                </Heading>
                <Text mt={2}>
                    <strong>Retention Period:</strong> Personal data is kept as long as necessary for the outlined purposes or as required by law.
                </Text>
                <Text mt={2}>
                    <strong>Data Deletion:</strong> Information is deleted or anonymized when no longer needed, with some exceptions for legal compliance.
                </Text>

                {/* Section 7 */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    7. How Do We Keep Your Information Safe?
                </Heading>
                <Text mt={2}>
                    <strong>Security Measures:</strong> Implements technical and organizational safeguards to protect personal data.
                </Text>
                <Text mt={2}>
                    <strong>Limitations:</strong> Acknowledges that no system is entirely secure and advises users to access services in a secure environment.
                </Text>

                {/* Section 8 */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    8. Do We Collect Information From Minors?
                </Heading>
                <Text mt={2}>
                    <strong>Policy:</strong> Does not knowingly collect data from individuals under 18 years of age.
                </Text>
                <Text mt={2}>
                    <strong>Action:</strong> Accounts of minors discovered are deactivated and data is deleted.
                </Text>

                {/* Section 9 */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    9. What Are Your Privacy Rights?
                </Heading>
                <Text mt={2}>
                    <strong>General Rights:</strong> Access, correct, delete personal data, and withdraw consent.
                </Text>
                <Text mt={2}>
                    <strong>Specific Rights for US Residents:</strong> Additional rights for residents of certain states, including California's "Shine The Light" law.
                </Text>
                <Text mt={2}>
                    <strong>Exercising Rights:</strong> Users can submit data subject access requests via email or designated forms.
                </Text>

                {/* Section 10 */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    10. Controls for Do-Not-Track Features
                </Heading>
                <Text mt={2}>
                    <strong>Current Stance:</strong> Does not respond to DNT signals as no standard is universally adopted.
                </Text>
                <Text mt={2}>
                    <strong>Future Updates:</strong> Will inform users if they start honoring DNT signals in the future.
                </Text>

                {/* Section 11 */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    11. Do United States Residents Have Specific Privacy Rights?
                </Heading>
                <Text mt={2}>
                    <strong>Expanded Rights:</strong> Residents of states like California, Colorado, and others have rights to access, correct, delete, and limit the use of their personal data.
                </Text>
                <Text mt={2}>
                    <strong>Shine The Light Law:</strong> Allows California residents to request information about personal data shared for direct marketing.
                </Text>

                {/* Section 12 */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    12. Do We Make Updates to This Notice?
                </Heading>
                <Text mt={2}>
                    <strong>Policy Updates:</strong> May update the Privacy Policy as needed to comply with laws.
                </Text>
                <Text mt={2}>
                    <strong>Notification:</strong> Users will be informed of significant changes through notices or direct communication.
                </Text>

                {/* Section 13 */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    13. How Can You Contact Us About This Notice?
                </Heading>
                <Text mt={2}>
                    If you have questions or comments about this notice, you may{' '}
                    <strong>
                        <Link href="mailto:Ujjwal@kirkwall.io" color="teal.500">
                            email us at Ujjwal@kirkwall.io
                        </Link>
                    </strong>{' '}
                    or mail us at:
                </Text>
                <Box mt={2} pl={4}>
                    <Text>
                        <strong>Kirkwall Defense Inc.</strong>
                    </Text>
                    <Text>
                        1854 NDSU Research Circle North
                    </Text>
                    <Text>
                        Fargo, ND 58102
                    </Text>
                    <Text>
                        United States
                    </Text>
                </Box>

                {/* Section 14 */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    14. How Can You Review, Update, Or Delete The Data We Collect From You?
                </Heading>
                <Text mt={2}>
                    Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please{' '}
                    {/* <strong>
                        <Link 
                            href="https://app.termly.io/notify/db820a1d-f58d-48f6-a943-5e9f52b130c5" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            color="teal.500"
                        >
                            fill out and submit a data subject access request
                        </Link>
                    </strong> */}
                    {/* , or{' '} */}
                    <strong>
                        <Link href="mailto:Ujjwal@kirkwall.io" color="teal.500">
                            contact us by emailing at Ujjwal@kirkwall.io
                        </Link>
                    </strong>
                    .
                </Text>

                {/* Section 15: Data Breach Notification */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    15. Data Breach Notification
                </Heading>
                <Text mt={2}>
                    In the event of a data breach that compromises your personal information, Kirkwall Defense Inc. will notify affected users within 72 hours of becoming aware of the breach. Notifications will be made via email and, where appropriate, through other communication channels.
                </Text>
                <Text mt={2}>
                    <strong>Actions We Will Take:</strong>
                </Text>
                <List spacing={2} mt={2}>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color={listIconColor} />
                        Identify and assess the breach.
                    </ListItem>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color={listIconColor} />
                        Notify affected users and relevant authorities.
                    </ListItem>
                    <ListItem>
                        <ListIcon as={CheckCircleIcon} color={listIconColor} />
                        Implement measures to prevent future breaches.
                    </ListItem>
                </List>

                {/* Section 16: International Data Transfers */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    16. International Data Transfers
                </Heading>
                <Text mt={2}>
                    Your information may be transferred to and maintained on servers located outside your country of residence. By using our services, you consent to the transfer of your information to countries that may have different data protection laws than your country.
                </Text>
                <Text mt={2}>
                    We ensure that such transfers are compliant with applicable laws, using mechanisms like Standard Contractual Clauses (SCCs) to protect your data.
                </Text>

                {/* Section 18: Glossary */}
                <Heading as="h2" size="lg" mt={6} color={sectionHeading}>
                    18. Glossary
                </Heading>
                <Text mt={2}>
                    <strong>Personal Data:</strong> Information that can identify an individual.
                </Text>
                <Text mt={2}>
                    <strong>Data Controller:</strong> Entity determining the purposes and means of processing personal data.
                </Text>
                <Text mt={2}>
                    <strong>Data Processor:</strong> Entity processing personal data on behalf of the Data Controller.
                </Text>
                <Text mt={2}>
                    <strong>Data Breach:</strong> Unauthorized access, disclosure, or destruction of personal data.
                </Text>
                <Text mt={2}>
                    <strong>Standard Contractual Clauses (SCCs):</strong> Legal tools used to ensure data protection during international transfers.
                </Text>

                {/* Section 19: Definitions (if further needed) */}
                {/* You can add more definitions or a link to a separate glossary page if necessary */}

                {/* Conclusion */}
                <Text mt={6} fontSize="lg">
                    Thank you for trusting Kirkwall Defense Inc. with your personal information. We are dedicated to safeguarding your privacy and ensuring a secure experience.
                </Text>
            </Box>
        </Box>
    );
};

export default PrivacyPolicy;
