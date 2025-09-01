import { useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import MembershipPlansGrid from '../components/MembershipPlansGrid';
import { useActiveMembershipPlans } from '../hooks/useMembershipPlans';
import { usePageMeta } from '../hooks/useMetaTags';

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const {
    activePlans,
    isLoading: plansLoading,
    error,
  } = useActiveMembershipPlans();

  // Set page-specific meta tags
  usePageMeta(
    'Pricing Plans - Choose Your Perfect Plan',
    'Unlock unlimited downloads and premium features with our flexible membership plans. Start with our free plan or upgrade for more power.',
    'pricing, membership plans, video downloader pricing, social media downloader plans'
  );

  const handleSelectPlan = plan => {
    setSelectedPlan(plan);
    toast.success(`You selected the ${plan.name} plan!`);
    // TODO: Implement plan selection logic (redirect to payment, etc.)
  };

  const handleGetStarted = () => {
    if (selectedPlan) {
      console.log('Getting started with plan:', selectedPlan);
      toast.success(`Getting started with ${selectedPlan.name} plan!`);
      // TODO: Implement payment flow or registration
    } else {
      toast.error('Please select a plan first');
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock unlimited downloads and premium features with our flexible
            membership plans. Start with our free plan or upgrade for more
            power.
          </p>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-8 text-center">
              <Card className="bg-red-50 border-red-200">
                <p className="text-red-600">
                  Failed to load pricing plans. Please try refreshing the page.
                </p>
              </Card>
            </div>
          )}

          {plansLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-lg text-gray-600">
                Loading pricing plans...
              </p>
            </div>
          ) : activePlans.length > 0 ? (
            <MembershipPlansGrid
              plans={activePlans}
              onSelectPlan={handleSelectPlan}
              selectedPlanId={selectedPlan?.id}
              className="mb-12"
            />
          ) : (
            <div className="text-center py-12">
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Plans Available
                </h3>
                <p className="text-gray-600">
                  We're currently updating our pricing plans. Please check back
                  soon!
                </p>
              </Card>
            </div>
          )}

          {/* Selected Plan Summary */}
          {selectedPlan && (
            <div className="max-w-2xl mx-auto">
              <Card className="bg-blue-50 border-blue-200">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Selected Plan: {selectedPlan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedPlan.description}
                  </p>
                  <div className="text-2xl font-bold text-blue-600 mb-6">
                    {selectedPlan.formatted_price}
                    {selectedPlan.billing_cycle !== 'lifetime' && (
                      <span className="text-lg text-gray-600 ml-1">
                        /{selectedPlan.billing_cycle_label.toLowerCase()}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="primary"
                    size="large"
                    onClick={handleGetStarted}
                    className="w-full sm:w-auto"
                  >
                    Get Started with {selectedPlan.name}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Everything you need to know about our pricing plans
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                will be reflected in your next billing cycle.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and other secure
                payment methods to make your subscription process smooth and
                secure.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Our Free plan gives you access to basic features with limited
                downloads. You can upgrade to a paid plan anytime for unlimited
                access.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll
                continue to have access until the end of your current billing
                period.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of users who trust our platform for their video
            downloading needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="large"
              onClick={() => {
                // TODO: Navigate to home page
                window.location.href = '/';
              }}
            >
              Try Free Version
            </Button>
            <Button
              variant="primary"
              size="large"
              onClick={() => {
                if (activePlans.length > 0) {
                  const featuredPlan =
                    activePlans.find(plan => plan.is_featured) ||
                    activePlans[0];
                  handleSelectPlan(featuredPlan);
                }
              }}
              className="bg-white text-blue-600 hover:bg-gray-50"
            >
              Choose Premium Plan
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PricingPage;
