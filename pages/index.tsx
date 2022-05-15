import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import {
	connectUserWallet,
	getTransactionFee,
	sendTransaction
} from '../API/wallet'
import { userWallet } from '../API/storage'
import Container from '../components/Container'
import PercentagePicker from '../components/PercentagePicker'
import Button from '../components/Button'

const Home: NextPage = () => {
	const [walletInfo, setWalletInfo] = useState({
		balance: { eth: 0, weenus: 0 },
		account: ''
	})
	const [token, setToken] = useState('eth')
	const [showReviewTransaction, setShowReviewTransaction] = useState(false)
	const [sendAmount, setSendAmount] = useState(0)
	const [receiverAddress, setReceiverAddress] = useState(
		'0x0000000000000000000000000000000000000000'
	)
	const [transactionFee, setTransactionFee] = useState(0)

	const prepareToSendTransaction = async () => {
		console.log(
			sendAmount,
			walletInfo.balance[token],
			sendAmount > walletInfo.balance[token]
		)
		if (
			sendAmount === 0 ||
			sendAmount * 10 ** 18 > parseInt(walletInfo.balance[token])
		) {
			console.log('if')
			alert('Invalid Amount')
			return
		}

		setTransactionFee(
			await getTransactionFee(walletInfo.account, receiverAddress)
		)
		setShowReviewTransaction(true)
	}

	const confirmTransaction = async () => {
		sendTransaction(walletInfo.account, receiverAddress, sendAmount)
		setShowReviewTransaction(false)
	}

	useEffect(() => {
		;(async () => {
			if (await connectUserWallet()) {
				setWalletInfo(userWallet.get())
			}
		})()
	}, [])

	return (
		<>
			<Head>
				<title>Sovryn</title>
				<meta
					name="description"
					content="App created to interact with Metamask ETH Testnet"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Container>
				<div className="flex flex-col text-white border px-8 py-8 rounded-3xl max-w-md mx-auto">
					{!showReviewTransaction ? (
						<>
							<h1 className="text-2xl font-bold mb-10 self-center">
								SEND
							</h1>
							<section className="mb-6">
								<label>Asset:</label>
								<div className="flex border border-blue-400 rounded-xl mt-2">
									<button
										onClick={() => setToken('eth')}
										className={`${
											token === 'eth' ? 'bg-blue-900' : ''
										} py-2 px-4 w-full border-r rounded-xl rounded-r-none border-blue-400`}
									>
										rETH
									</button>
									<button
										onClick={() => setToken('weenus')}
										className={`${
											token != 'eth' ? 'bg-blue-900' : ''
										} py-2 px-4 w-full rounded-xl rounded-l-none border-blue-400`}
									>
										WEENUS
									</button>
								</div>
								<p className="text-xs mt-1">
									Available Balance{' '}
									{walletInfo.balance[token] / 10 ** 18}
									{token === 'eth' ? ' rETH' : ' WEENUS'}
								</p>
							</section>
							<section className="mb-6">
								<label>Amount:</label>
								<input
									value={sendAmount || 0}
									onChange={e =>
										setSendAmount(parseInt(e.target.value))
									}
									className="rounded w-full mt-2 text-black text-center"
								/>
								<PercentagePicker
									onUsePercentage={setSendAmount}
									balance={
										walletInfo.balance[token] / 10 ** 18
									}
									classes="mt-3 mb-5"
								/>
							</section>
							<section className="mb-6">
								<label>Send To:</label>
								<input
									value={receiverAddress}
									onChange={e =>
										setReceiverAddress(e.target.value)
									}
									className="rounded w-full mt-2 text-black text-center text-sm"
								/>
							</section>
							<Button
								onClick={() => prepareToSendTransaction()}
								classes="w-40 self-center"
							>
								SUBMIT
							</Button>
						</>
					) : (
						<div className="flex flex-col items-center">
							<h1 className="text-xl mb-8">Review Transaction</h1>
							<section className="mb-4 flex flex-col items-center">
								<p className="text-lg">SEND</p>
								<p>
									{sendAmount}
									{token === 'eth' ? ' rETH' : ' WEENUS'}
								</p>
							</section>
							<section className="flex flex-col mb-8">
								<p className="text-xs whitespace-nowrap">
									From: {walletInfo.account}
								</p>
								<div className="self-center my-2">
									arrow icon
								</div>
								<p className="text-xs whitespace-nowrap">
									To: {receiverAddress}
								</p>
							</section>

							<section className="flex w-2/3 justify-between">
								<p className="text-sm">Tx Fee:</p>
								<p className="text-sm">
									~{(transactionFee / 10 ** 18).toFixed(6)}{' '}
									rBTC
								</p>
							</section>
							<Button
								onClick={confirmTransaction}
								classes="w-40 mt-5"
								disabled={!receiverAddress || !sendAmount}
							>
								CONFIRM
							</Button>
							<Button
								onClick={() => setShowReviewTransaction(false)}
								classes="w-40 mt-5"
							>
								CANCEL
							</Button>
						</div>
					)}
				</div>
			</Container>
		</>
	)
}

export default Home
