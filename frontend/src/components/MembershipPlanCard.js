import Card from './Card';
import Button from './Button';

const MembershipPlanCard = ({
  plan,
  onSelectPlan,
  isSelected = false,
  showSelectButton = true,
  className = '',
  ...props
}) => {
  if (!plan) return null;

  const handleSelectPlan = () => {
    if (onSelectPlan) {
      onSelectPlan(plan);
    }
  };

  const formatFeatures = () => {
    const features = [];

    // Daily requests
    if (plan.has_unlimited_daily_requests) {
      features.push('Unlimited daily downloads');
    } else if (plan.daily_request_limit > 0) {
      features.push(`${plan.daily_request_limit} downloads per day`);
    }

    // Total requests
    if (plan.has_unlimited_total_requests) {
      features.push('Unlimited total downloads');
    } else if (plan.total_request_download > 0) {
      features.push(`${plan.total_request_download} total downloads`);
    }

    // Platforms
    if (plan.allowed_platforms && plan.allowed_platforms.length > 0) {
      const platformNames = plan.allowed_platforms.map(
        platform => platform.charAt(0).toUpperCase() + platform.slice(1)
      );
      features.push(`Platforms: ${platformNames.join(', ')}`);
    }

    // Quality
    if (plan.allowed_qualities && plan.allowed_qualities.length > 0) {
      features.push(`Quality: ${plan.allowed_qualities.join(', ')}`);
    }

    // File size
    if (plan.max_file_size_mb > 0) {
      features.push(`Max file size: ${plan.max_file_size_mb}MB`);
    }

    // Priority processing
    if (plan.priority_processing) {
      features.push('Priority processing');
    }

    return features;
  };

  const features = formatFeatures();
  const cardClasses = `${className} ${plan.is_featured ? 'ring-2 ring-blue-500' : ''}`;

  return (
    <Card className={cardClasses} hover={!isSelected} {...props}>
      {/* Featured badge */}
      {plan.is_featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        {/* Plan name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>

        {/* Price */}
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">
            {plan.formatted_price}
          </span>
          {plan.billing_cycle !== 'lifetime' && (
            <span className="text-gray-600 ml-1">
              /{plan.billing_cycle_label.toLowerCase()}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm">{plan.description}</p>
      </div>

      {/* Features list */}
      <div className="mb-6">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Select button */}
      {showSelectButton && (
        <div className="mt-auto">
          <Button
            variant={plan.is_featured ? 'primary' : 'secondary'}
            size="medium"
            onClick={handleSelectPlan}
            disabled={isSelected}
            className="w-full"
          >
            {isSelected ? 'Selected' : 'Choose Plan'}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MembershipPlanCard;
