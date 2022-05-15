import { connectUserWallet } from '../../API/wallet'

export default function Header() {
	return (
		<header className="flex justify-between bg-black py-2 px-3">
			<p className="text-white">SOVRYN</p>
			<p onClick={connectUserWallet} className="text-white">
				widget
			</p>
		</header>
	)
}
