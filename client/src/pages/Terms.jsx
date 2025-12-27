import { Link } from "react-router-dom";
import { Leaf, ArrowLeft, Shield, Users, Lock, FileText, Scale, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
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
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
            <FileText className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using EcoMunch. By using our service, you agree to be bound by these terms.
          </p>
          <p className="text-emerald-200 text-sm mt-4">
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { icon: Shield, label: "Acceptance", href: "#acceptance" },
                { icon: Users, label: "User Accounts", href: "#accounts" },
                { icon: FileText, label: "Content", href: "#content" },
                { icon: Lock, label: "Privacy", href: "#privacy" },
                { icon: Scale, label: "Liability", href: "#liability" },
                { icon: Mail, label: "Contact", href: "#contact" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 p-3 rounded-lg bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                >
                  <item.icon className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Terms Content */}
          <div className="p-6 md:p-10 space-y-10">
            {/* Section 1 */}
            <section id="acceptance">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  By accessing or using EcoMunch ("the Service"), you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our service.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  EcoMunch reserves the right to update these terms at any time. We will notify users of any 
                  significant changes via email or through the platform. Your continued use of the service 
                  after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="accounts">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. User Accounts</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  To access certain features of EcoMunch, you must create an account. You agree to:
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                    Provide accurate and complete information during registration
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                    Maintain the security of your password and account
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                    Notify us immediately of any unauthorized access
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                    Be at least 13 years of age to use the service
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="content">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. User Content</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  You retain ownership of any recipes, images, or content you submit to EcoMunch. 
                  By posting content, you grant us a non-exclusive, worldwide, royalty-free license to 
                  use, display, and distribute your content on our platform.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Important:</strong> You are responsible for ensuring your content does not 
                    violate any copyright laws or contain harmful, offensive, or misleading information.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="privacy">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Privacy & Data</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  Your privacy is important to us. Our use of your personal information is governed by 
                  our Privacy Policy. By using EcoMunch, you consent to the collection and use of 
                  information as described in our Privacy Policy.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  We collect information such as your name, email address, and recipe preferences to 
                  provide and improve our services. We do not sell your personal data to third parties.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="liability">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Scale className="h-4 w-4 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Limitation of Liability</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  EcoMunch provides recipes and nutritional information for educational purposes only. 
                  We are not responsible for:
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                    Any adverse reactions or allergies from following recipes
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                    Accuracy of nutritional information provided by users
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                    Service interruptions or data loss
                  </li>
                </ul>
                <div className="bg-gray-100 rounded-lg p-4 mt-4">
                  <p className="text-gray-700 text-sm">
                    Always consult with a healthcare professional before making significant dietary changes, 
                    especially if you have food allergies or medical conditions.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="contact">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">6. Contact Us</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mt-4">
                  <div className="space-y-2">
                    <p className="text-emerald-800">
                      <strong>Email:</strong> support@ecomunch.com
                    </p>
                    <p className="text-emerald-800">
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
                By creating an account, you acknowledge that you have read and agree to these terms.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link to="/privacy">
                  <Button variant="outline" className="border-gray-300">
                    View Privacy Policy
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
