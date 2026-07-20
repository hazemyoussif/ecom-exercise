import { useBundle } from '../hooks/useBundle';
import { useVariant } from '../hooks/useVariant';
import { useStepper } from '../hooks/useStepper';
import type { Product } from '../types/product';
import Stepper from './Stepper';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { bundle } = useBundle();
  const { selectedVariant, selectedVariantId, variants, changeVariant } = useVariant(product.id);
  const { quantity, increment, decrement, canDecrement } = useStepper(product.id);
  const isProductSelected = Object.values(bundle.quantities[product.id] ?? {}).some((selectedQuantity) => selectedQuantity > 0);

  return (
    <div className={`product-card ${isProductSelected ? 'product-card--selected' : ''}`}>
      {product.badge && <span className="product-card__badge">{product.badge}</span>}

      <div className="product-card__image-wrap">
        <img src={selectedVariant?.image} alt={product.name} className="product-card__image" />
      </div>

      <div className="product-card__content">
        <div className="product-card__info">
          <h3 className="product-card__title">{product.name}</h3>
          <span className="product-card__description">
            {product.description}{' '}
            {product.link && <a href={product.link} className="product-card__link">Learn More</a>}
          </span>
        </div>

        <div className="product-card__variants">
          {variants.length > 1 && variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => changeVariant(variant.id)}
              className={`product-card__variant ${selectedVariantId === variant.id ? 'product-card__variant--active' : ''}`}
            >
              <img height="22" width="22" src={variant.image} alt={variant.label} />
              <span className="product-card__variant-label">{variant.label}</span>
            </button>
          ))}
        </div>

        <div className="product-card__footer">
          <Stepper
            compact
            value={quantity}
            canDecrement={canDecrement}
            onIncrement={increment}
            onDecrement={decrement}
          />
          <div className="product-card__price">
            {product.compareAtPrice && <span className="product-card__price-compare">${product.compareAtPrice}</span>}
            <span className="product-card__price-current">${product.basePrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;