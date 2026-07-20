import type { ReviewItem } from '../types/review';
import Stepper from './Stepper';
import { useStepper } from '../hooks/useStepper';

interface ReviewPanelItemProps {
  item: ReviewItem;
}

const ReviewPanelItem = ({ item }: ReviewPanelItemProps) => {
  const { quantity, increment, decrement, canDecrement } = useStepper(item.productId, item.variantId);
  const { product } = item;

  return (
    <div className="review-panel__item">
      <div className="review-panel__item-image-wrap">
        <img src={item.variantImage} alt={product.name} className="review-panel__item-image" />
      </div>

      <div className="review-panel__item-copy">
        <p className="review-panel__item-name">{product.name}</p>
        {item.variantLabel !== 'Default' && <p className="review-panel__item-variant">{item.variantLabel}</p>}
      </div>

      {!product.isSubscription && (
        <Stepper
          value={quantity}
          canDecrement={canDecrement}
          onIncrement={increment}
          onDecrement={decrement}
          compact
        />
      )}

      <div className="review-panel__item-price">
        {product.compareAtPrice && (
          <span className="review-panel__item-compare-price-value">
            ${(item.compareAtUnitPrice * quantity).toFixed(2)} {product.isSubscription && '/mo'}
          </span>
        )}
        <span className="review-panel__item-price-value">
          {product.basePrice === 0 ? 'FREE' : `$${(item.unitPrice * quantity).toFixed(2)}`} {product.isSubscription && '/mo'}
        </span>
      </div>
    </div>
  );
};

export default ReviewPanelItem;