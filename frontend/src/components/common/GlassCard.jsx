const GlassCard = ({ children, className = "" }) => {
  return (
    <div className={`glass-card rounded-xl ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;