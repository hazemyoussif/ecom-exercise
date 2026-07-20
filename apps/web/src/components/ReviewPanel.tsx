import { useMemo } from 'react';
import fastShippingIcon from '../assets/icons/fast-shipping.svg';
import satisfactionBadge from '../assets/images/satisfaction-badge.png';
import './ReviewPanel.css';
import type { ReviewItem } from '../types/review';
import ReviewPanelItem from './ReviewPanleItem';
import { usePersistence } from '../hooks/usePersistence';
import { usePricing } from '../hooks/usePricing';
import { useReviewItems } from '../hooks/useReviewItems';

const categoriesOrder = ['cameras', 'sensors', 'accessories', 'plan'];

export default function ReviewPanel() {
  const reviewItems = useReviewItems();
  const { comparePrice, total, savings } = usePricing(reviewItems);
  const { save } = usePersistence();

  const groupedItems = useMemo(
    () => reviewItems.reduce<Record<string, ReviewItem[]>>((groups, item) => {
      const categoryId = item.product.categoryId;
      (groups[categoryId] ??= []).push(item);
      return groups;
    }, {}),
    [reviewItems],
  );

  const saveForLater = () => {
    save();
    window.alert('Your system has been saved for later!');
  };

  return (
    <aside className="review-panel">
      <h6 className="review-panel__initial">REVIEW</h6>
      <div className="review-panel__main" >
        <div className="review-panel__details" >

          <div className="review-panel__header">
            <h2 className="review-panel__title">Your security system</h2>
            <p className="review-panel__subtitle">
              Review your personalized protection system designed to keep what matters most safe.
            </p>
          </div>

          <div className="review-panel__content">
            {categoriesOrder.map((categoryId) => {
              const items = groupedItems[categoryId];
              if (!items?.length) return null;

              return (
                <section key={categoryId} className="review-panel__section">
                  <h3 className="review-panel__section-title">{categoryId}</h3>
                  <div className="review-panel__items">
                    {items.map((item) => <ReviewPanelItem key={item.key} item={item} />)}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="review-panel__footer">
            <div className="review-panel__shipping-row">
              <div className="review-panel__shipping-label">
                <span className="review-panel__shipping-icon-wrap">
                  <img src={fastShippingIcon} alt="" className="review-panel__shipping-icon" />
                </span>
                <span>Fast Shipping</span>
              </div>
              <div className="review-panel__shipping-price">
                <span className="review-panel__shipping-compare-price">$5.99</span>
                <span>FREE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="review-panel__total-row">
          <div className="review-panel__summary-card">
            <div className="review-panel__summary-top">
              <img src={satisfactionBadge} alt="Wyze satisfaction guarantee" className="review-panel__satisfaction-badge" />
              <div className="review-panel__total-details">
                <span className="review-panel__financing-copy">as low as $19.19/mo</span>
                <div className="review-panel__totals">
                  {savings > 0 && <span className="review-panel__compare-price">${comparePrice.toFixed(2)}</span>}
                  <span className="review-panel__total-price">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {savings > 0 && (
              <div className="review-panel__savings-pill">
                Congrats! You&apos;re saving ${savings.toFixed(2)} on your security bundle!
              </div>
            )}

            <button className="review-panel__checkout-button" type="button">Checkout</button>
          </div>

          <div className="review-panel__save-row">
            <button onClick={saveForLater} className="review-panel__save-button" type="button">
              Save my system for later
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}