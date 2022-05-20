type walletInfo = {
	connected: boolean
	balance: { eth: number; weenus: number }
	account: string
}

export default function Header({
	walletInfo,
	connect,
	disconnect,
	classes = ''
}: {
	walletInfo: walletInfo
	connect: () => void
	disconnect: () => void
	classes?: string
}) {
	return (
		<header
			className={`px-4 text-xs flex justify-between text-white items-center bg-black ${
				classes ? classes : ''
			}`}
		>
			<img src="/icons/logo.svg" width={175} />
			{walletInfo.connected ? (
				<div className="flex">
					<div className="flex bg-gray-200 rounded-lg rounded-r-none pr-2 py-2 px-3">
						<p className="mr-2">
							{walletInfo.account.slice(0, 4) +
								'....' +
								walletInfo.account.slice(-4)}
						</p>
						<div>user image</div>
					</div>
					<img
						onClick={disconnect}
						src="/icons/logout.svg"
						className="bg-gray-100 px-2 rounded-r-lg cursor-pointer"
					/>
				</div>
			) : (
				<button
					onClick={connect}
					className="px-4 py-2 text-yellow-400 border-yellow-400 border rounded-lg hover:bg-yellow-400 hover:text-black"
				>
					Engage Wallet
				</button>
			)}
		</header>
	)
}
