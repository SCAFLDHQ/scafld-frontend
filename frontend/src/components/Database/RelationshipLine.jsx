const RelationshipLine = ({ from, to, type, fromField, toField }) => {
    if (!from || !to) return null;
  
    // Calculate midpoint for the relationship label
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
  
    // Create a curved path for the relationship line
    const controlX1 = from.x + (to.x - from.x) * 0.5;
    const controlY1 = from.y;
    const controlX2 = to.x - (to.x - from.x) * 0.5;
    const controlY2 = to.y;
  
    // Calculate direction for arrow
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
  
    return (
      <g>
        {/* Curved line */}
        <path
          className="connection-line"
          d={`M ${from.x} ${from.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${to.x} ${to.y}`}
          fill="none"
          strokeWidth="2"
        />
        
        {/* Arrow head */}
        <path
          d={`M ${to.x} ${to.y} L ${to.x - 10 * Math.cos(angle) + 5 * Math.sin(angle)} ${to.y - 10 * Math.sin(angle) - 5 * Math.cos(angle)} L ${to.x - 10 * Math.cos(angle) - 5 * Math.sin(angle)} ${to.y - 10 * Math.sin(angle) + 5 * Math.cos(angle)} Z`}
          fill="#bc06f9"
          stroke="#bc06f9"
          strokeWidth="1"
        />
        
        {/* Relationship type indicator */}
        <rect 
          x={midX - 20} 
          y={midY - 15} 
          width="40" 
          height="20" 
          rx="4"
          fill="#121212" 
          stroke="#bc06f9" 
          strokeWidth="1"
        />
        <text 
          x={midX} 
          y={midY} 
          textAnchor="middle" 
          dominantBaseline="middle" 
          className="text-xs font-bold fill-primary"
          fontSize="10"
        >
          {type}
        </text>
        
        {/* Field labels */}
        {fromField && (
          <g>
            <rect 
              x={from.x - 60} 
              y={from.y - 12} 
              width="50" 
              height="16" 
              rx="3"
              fill="#1a1a1a" 
              stroke="#bc06f9" 
              strokeWidth="1"
            />
            <text 
              x={from.x - 35} 
              y={from.y - 2} 
              textAnchor="middle" 
              className="text-xs fill-white"
              fontSize="9"
            >
              {fromField}
            </text>
          </g>
        )}
        
        {toField && (
          <g>
            <rect 
              x={to.x + 10} 
              y={to.y - 12} 
              width="50" 
              height="16" 
              rx="3"
              fill="#1a1a1a" 
              stroke="#bc06f9" 
              strokeWidth="1"
            />
            <text 
              x={to.x + 35} 
              y={to.y - 2} 
              textAnchor="middle" 
              className="text-xs fill-white"
              fontSize="9"
            >
              {toField}
            </text>
          </g>
        )}
      </g>
    );
  };
  
  export default RelationshipLine;