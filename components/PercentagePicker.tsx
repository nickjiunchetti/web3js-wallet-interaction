type Props = {
	onUsePercentage: (number: number) => void
	balance: number
	classes?: string
}

export default function Button({
	onUsePercentage,
	balance,
	classes = ''
}: Props) {
	const percentageClass = `w-full py-1 px-2 text-blue-300 border-r border-blue-300 hover:bg-blue-300/50`

	return (
		<div className={`flex border border-blue-300 rounded-lg ${classes}`}>
			<button
				className={percentageClass}
				onClick={() => onUsePercentage(0.1 * balance)}
			>
				10%
			</button>
			<button
				className={percentageClass}
				onClick={() => onUsePercentage(0.25 * balance)}
			>
				25%
			</button>
			<button
				className={percentageClass}
				onClick={() => onUsePercentage(0.5 * balance)}
			>
				50%
			</button>
			<button
				className={percentageClass}
				onClick={() => onUsePercentage(0.75 * balance)}
			>
				75%
			</button>
			<button
				className={percentageClass + ' border-none'}
				onClick={() => onUsePercentage(balance)}
			>
				100%
			</button>
		</div>
	)
}
