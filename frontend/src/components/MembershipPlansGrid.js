import { useState } from 'react';
import MembershipPlanCard from './MembershipPlanCard';

const MembershipPlansGrid = ({
  plans = [],
  onSelectPlan,
  selectedPlanId = null,
  showSelectButton = true,
  maxPlans = null,
  className = '',
  cardClassName = '',
  ...props
}) => {
  const [selectedPlan, setSelectedPlan] = useState(selectedPlanId);

  const handleSelectPlan = plan => {
    setSelectedPlan(plan.id);
    if (onSelectPlan) {
      onSelectPlan(plan);
    }
  };

  // Limit plans if maxPlans is specified
  const displayPlans = maxPlans ? plans.slice(0, maxPlans) : plans;

  if (displayPlans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          No membership plans available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      {...props}
    >
      {displayPlans.map(plan => (
        <div key={plan.id} className="relative">
          <MembershipPlanCard
            plan={plan}
            onSelectPlan={handleSelectPlan}
            isSelected={selectedPlan === plan.id}
            showSelectButton={showSelectButton}
            className={cardClassName}
          />
        </div>
      ))}
    </div>
  );
};

export default MembershipPlansGrid;
