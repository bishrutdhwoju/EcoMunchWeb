import { Link } from "react-router-dom";
import { Leaf, ArrowLeft, Shield, Eye, Database, Lock, Bell, UserCheck, Globe, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-emerald-700">EcoMunch</span>
          </Link>
          <Link to="/register">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Register
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Your privacy matters to us. Learn how we collect, use, and protect your personal information at EcoMunch.
          </p>
          <p className="text-blue-200 text-sm mt-4">
            Last updated: January 28, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          {/* Quick Navigation */}
          <div className="bg-gray-50 border-b border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Database, label: "Data Collection", href: "#collection" },
                { icon: Eye, label: "How We Use Data", href: "#usage" },
                { icon: Lock, label: "Data Protection", href: "#protection" },
                { icon: UserCheck, label: "Your Rights", href: "#rights" },
                { icon: Bell, label: "Cookies", href: "#cookies" },
                { icon: Globe, label: "Third Parties", href: "#third-parties" },
                { icon: Shield, label: "Children's Privacy", href: "#children" },
                { icon: Mail, label: "Contact", href: "#contact" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <item.icon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Privacy Content */}
          <div className="p-6 md:p-10 space-y-10">
            {/* Section 1 */}
            <section id="collection">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Database className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  We collect information to provide better services to our users. The types of information we collect include:
                </p>
                
                <div className="mt-6 space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Personal Information</h3>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li>• Name and email address</li>
                      <li>• Phone number (optional)</li>
                      <li>• Date of birth (optional)</li>
                      <li>• Profile picture (optional)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Recipes you view and bookmark</li>
                      <li>• Recipes you create and share</li>
                      <li>• Search queries and preferences</li>
                      <li>• Device and browser information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="usage">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 text-gray-600">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
                    <span><strong>Provide Services:</strong> To create and manage your account, display recipes, and enable social features.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
                    <span><strong>Personalization:</strong> To recommend recipes based on your preferences and cooking level.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
                    <span><strong>Communication:</strong> To send you updates, newsletters, and respond to inquiries.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-medium flex-shrink-0">4</span>
                    <span><strong>Security:</strong> To detect and prevent fraud, abuse, and security threats.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="protection">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. Data Protection & Security</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  We take the security of your data seriously and implement various measures to protect it:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-green-600" />
                      <h3 className="font-semibold text-green-900">Encryption</h3>
                    </div>
                    <p className="text-green-800 text-sm">All data is encrypted in transit using TLS/SSL protocols.</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <h3 className="font-semibold text-green-900">Secure Storage</h3>
                    </div>
                    <p className="text-green-800 text-sm">Passwords are hashed and never stored in plain text.</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="h-4 w-4 text-green-600" />
                      <h3 className="font-semibold text-green-900">Access Control</h3>
                    </div>
                    <p className="text-green-800 text-sm">Limited employee access to personal data on need-to-know basis.</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="h-4 w-4 text-green-600" />
                      <h3 className="font-semibold text-green-900">Monitoring</h3>
                    </div>
                    <p className="text-green-800 text-sm">Regular security audits and monitoring for suspicious activity.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="rights">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Your Rights</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  You have the following rights regarding your personal data:
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                    <strong>Access:</strong> Request a copy of your personal data
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                    <strong>Correction:</strong> Update or correct inaccurate information
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                    <strong>Deletion:</strong> Request deletion of your account and data
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                    <strong>Portability:</strong> Export your data in a common format
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                    <strong>Opt-out:</strong> Unsubscribe from marketing communications
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section id="cookies">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Cookies & Tracking</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <h3 className="font-semibold text-amber-900 mb-2">Types of Cookies We Use</h3>
                  <ul className="space-y-2 text-amber-800 text-sm">
                    <li><strong>Essential:</strong> Required for basic functionality (login, security)</li>
                    <li><strong>Preferences:</strong> Remember your settings and preferences</li>
                    <li><strong>Analytics:</strong> Help us understand how you use our service</li>
                  </ul>
                </div>
                <p className="text-gray-600 leading-relaxed mt-4">
                  You can manage cookie preferences through your browser settings. Disabling certain cookies may affect functionality.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="third-parties">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">6. Third-Party Services</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  We may share limited information with trusted third parties:
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></span>
                    Cloud hosting providers for data storage
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></span>
                    Analytics services to improve our platform
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></span>
                    Email service providers for communications
                  </li>
                </ul>
                <div className="bg-gray-100 rounded-lg p-4 mt-4">
                  <p className="text-gray-700 text-sm">
                    <strong>We never sell your personal data to third parties.</strong> All partners are bound by strict confidentiality agreements.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="children">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">7. Children's Privacy</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  EcoMunch is not intended for children under 13 years of age. We do not knowingly collect 
                  personal information from children under 13. If you believe we have collected information 
                  from a child, please contact us immediately.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="contact">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">8. Contact Us</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  If you have questions about this Privacy Policy or want to exercise your rights, contact us:
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
                  <div className="space-y-2">
                    <p className="text-blue-800">
                      <strong>Privacy Officer:</strong> privacy@ecomunch.com
                    </p>
                    <p className="text-blue-800">
                      <strong>General Support:</strong> support@ecomunch.com
                    </p>
                    <p className="text-blue-800">
                      <strong>Address:</strong> Kathmandu, Nepal
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer CTA */}
          <div className="bg-gray-50 border-t border-gray-100 p-6 md:p-10">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                By using EcoMunch, you acknowledge that you have read and understood this Privacy Policy.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link to="/terms">
                  <Button variant="outline" className="border-gray-300">
                    View Terms of Service
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                    Back to Registration
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© 2026 EcoMunch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
