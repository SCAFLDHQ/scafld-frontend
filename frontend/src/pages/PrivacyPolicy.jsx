import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 font-display">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            How we protect and handle your data at The Builder's Website
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* Last Updated */}
          <div className="bg-primary/20 border-b border-primary/30 px-8 py-4">
            <p className="text-primary-text text-sm font-medium">
              Last Updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* Introduction */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white font-display">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                At <strong>The Builder's Website</strong>, we are committed to protecting 
                your privacy and ensuring the security of your personal information. This Privacy Policy explains 
                how we collect, use, disclose, and safeguard your information when you use our code generation 
                platform and related services.
              </p>
              <p className="text-gray-300 leading-relaxed">
                By using our platform, you consent to the data practices described in this policy. If you do not 
                agree with the terms of this Privacy Policy, please do not access the platform.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white font-display">2. Information We Collect</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">Personal Information</h3>
                  <ul className="text-gray-300 space-y-1 list-disc list-inside">
                    <li>Email address and contact information</li>
                    <li>Name and professional details</li>
                    <li>Account credentials and authentication data</li>
                    <li>Billing and payment information</li>
                  </ul>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">Technical Information</h3>
                  <ul className="text-gray-300 space-y-1 list-disc list-inside">
                    <li>IP address and browser type</li>
                    <li>Device information and operating system</li>
                    <li>Usage patterns and platform interactions</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">Project Data</h3>
                  <ul className="text-gray-300 space-y-1 list-disc list-inside">
                    <li>Database schemas and model designs</li>
                    <li>Generated code and project configurations</li>
                    <li>Framework preferences and settings</li>
                    <li>Export and download history</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white font-display">3. How We Use Your Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">Service Delivery</h3>
                  <p className="text-gray-300 text-sm">
                    To provide and maintain our code generation platform, process transactions, 
                    and deliver the services you request.
                  </p>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">Platform Improvement</h3>
                  <p className="text-gray-300 text-sm">
                    To enhance user experience, develop new features, and optimize our platform's 
                    performance and functionality.
                  </p>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">Communication</h3>
                  <p className="text-gray-300 text-sm">
                    To send important updates, security alerts, support messages, and information 
                    about your account and projects.
                  </p>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">Security & Compliance</h3>
                  <p className="text-gray-300 text-sm">
                    To protect against fraud, ensure platform security, and comply with legal 
                    obligations and industry standards.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Protection */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white font-display">4. Data Protection & Security</h2>
              <div className="bg-gray-700/30 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white font-medium">Encryption</span>
                    </div>
                    <p className="text-gray-300 text-sm ml-5">
                      All data is encrypted in transit using TLS 1.2+ and at rest using AES-256 encryption.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white font-medium">Access Controls</span>
                    </div>
                    <p className="text-gray-300 text-sm ml-5">
                      Strict role-based access controls and authentication mechanisms protect your data.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white font-medium">Regular Audits</span>
                    </div>
                    <p className="text-gray-300 text-sm ml-5">
                      Continuous security monitoring and regular penetration testing.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white font-medium">Data Backups</span>
                    </div>
                    <p className="text-gray-300 text-sm ml-5">
                      Automated backups and disaster recovery procedures ensure data integrity.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white font-display">5. Data Sharing & Disclosure</h2>
              <p className="text-gray-300 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                information only in the following circumstances:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium">Service Providers</h4>
                    <p className="text-gray-300 text-sm">
                      With trusted partners who assist in platform operations, payment processing, 
                      and customer support (all bound by strict confidentiality agreements).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium">Legal Requirements</h4>
                    <p className="text-gray-300 text-sm">
                      When required by law, court order, or governmental regulations to protect 
                      our rights, property, or safety.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium">Business Transfers</h4>
                    <p className="text-gray-300 text-sm">
                      In connection with a merger, acquisition, or sale of all or a portion of 
                      our assets, with appropriate privacy protections.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white font-display">6. Your Rights & Choices</h2>
              <div className="bg-gray-700/30 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Access & Control</h4>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Access and download your personal data</li>
                      <li>• Correct inaccurate information</li>
                      <li>• Delete your account and associated data</li>
                      <li>• Object to certain data processing</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Communication Preferences</h4>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Opt-out of marketing communications</li>
                      <li>• Adjust notification settings</li>
                      <li>• Manage cookie preferences</li>
                      <li>• Control data sharing preferences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white font-display">7. Contact Us</h2>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                <p className="text-gray-300 mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy 
                  or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-gray-300">
                  <p>📧 Email: privacy@thebuilderswebsite.com</p>
                  <p>🌐 Website: thebuilderswebsite.com/contact</p>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section className="space-y-4 pt-4 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-white font-display">Policy Updates</h2>
              <p className="text-gray-300 text-sm">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
                Continued use of our platform after any changes constitutes acceptance of the updated policy.
              </p>
            </section>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Thank you for trusting The Builder's Website with your projects and data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;