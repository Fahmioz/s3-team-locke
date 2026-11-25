const STEPS = ['Received', 'Preparing', 'Ready', 'Collected']

function OrderStatus({ status }) {
  const index = STEPS.indexOf(status)

  return (
    <ol className="status-steps" aria-label={`Status: ${status}`}>
      {STEPS.map((step, stepIndex) => (
        <li key={step} className={stepIndex <= index ? 'done' : ''}>{step}</li>
      ))}
    </ol>
  )
}

export default OrderStatus
