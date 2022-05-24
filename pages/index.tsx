import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import {
	connectUserWallet,
	getTransactionFee,
	sendTransaction,
	getUserBalance
} from '../API/wallet'

import Header from '../components/Header'
import PercentagePicker from '../components/PercentagePicker'
import Button from '../components/Button'

interface Wallet {
	connected: boolean
	account: string
	balance: {
		[key: string]: number
		eth: number
		weenus: number
	}
}

const Home: NextPage = () => {
	const initialWalletInfo: Wallet = {
		connected: false,
		balance: { eth: 0, weenus: 0 },
		account: ''
	}

	const initialTransactionInfo = {
		transactionHash: '',
		status: 'Awaiting Confirmation'
	}

	const [walletInfo, setWalletInfo] = useState(initialWalletInfo)
	const [pageStep, setPageStep] = useState('send')
	const [token, setToken] = useState('eth')
	const [sendAmount, setSendAmount] = useState(0)
	const [receiverAddress, setReceiverAddress] = useState(
		'0x0000000000000000000000000000000000000000'
	)
	const [transactionFee, setTransactionFee] = useState(0)
	const [transaction, setTransaction] = useState(initialTransactionInfo)

	const connectWallet = async () => {
		if (!walletInfo.connected) {
			const userInfo = await connectUserWallet()
			if (userInfo) setWalletInfo(userInfo)
		}
	}

	useEffect(() => {
		;(async () => {
			if (!walletInfo.connected) {
				const userInfo = await connectUserWallet()
				if (userInfo) setWalletInfo(userInfo)
			}
		})()
	}, [])

	const prepareToSendTransaction = async () => {
		if (
			sendAmount === 0 ||
			sendAmount * 10 ** 18 > Number(walletInfo.balance[token])
		) {
			alert('Invalid Amount')
			return
		}
		setTransactionFee(
			await getTransactionFee(walletInfo.account, receiverAddress)
		)
		setPageStep('review')
	}

	const confirmTransaction = async () => {
		setPageStep('details')

		const onTransactionHash = (hash: string) => {
			setTransaction({ transactionHash: hash, status: 'Pending' })
		}

		const onTransactionReceipt = async (hash: string) => {
			const newWalletBalance = await getUserBalance(walletInfo.account)
			setTransaction({ transactionHash: hash, status: 'Sucess' })
			setWalletInfo({
				...walletInfo,
				balance: newWalletBalance
			})

			alert(`Transaction Successful\nTxHash: ${hash}`)
		}

		const onTransactionError = (code: number, message: string) => {
			setTransaction({ transactionHash: '', status: 'Failed' })
			alert(`Transaction Failed. \nCode: ${code}\nError: \n${message}`)
		}

		setTransaction({ transactionHash: '', status: 'Awaiting confirmation' })

		sendTransaction(
			walletInfo.account,
			receiverAddress,
			token,
			sendAmount,
			onTransactionHash,
			onTransactionReceipt,
			onTransactionError
		)
	}

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
			<div className="fullScreen text-white-text bg-gray-300">
				<Header
					walletInfo={walletInfo}
					connect={() => connectWallet()}
					disconnect={() => setWalletInfo(initialWalletInfo)}
					classes="px-4 py-3"
				/>
				<div
					className={`bg-gray-500 mt-6 mx-4 md:mx-auto flex flex-col text-white border px-8 py-8 rounded-3xl max-w-sm ${
						walletInfo.connected ? '' : 'opacity-50'
					}`}
				>
					{pageStep === 'send' && (
						<>
							<h1 className="text-4xl font-bold mb-10 self-center">
								SEND
							</h1>
							<section className="mb-6">
								<label>Asset:</label>
								<div className="flex rounded-xl mt-2 border border-blue-300">
									<button
										onClick={() => setToken('eth')}
										className={`${
											token === 'eth'
												? 'bg-blue-300/50'
												: 'bg-blue-300/10 opacity-50'
										} flex justify-center py-1 px-4 w-full rounded-xl rounded-r-none border-r border-blue-300`}
									>
										<img
											src="/icons/eth.svg"
											height={24}
											className="mr-2"
										/>
										rETH
									</button>
									<button
										onClick={() => setToken('weenus')}
										className={`${
											token != 'eth'
												? 'bg-blue-300/50'
												: 'bg-blue-300/10 opacity-50'
										} flex justify-center py-1 px-4 w-full rounded-xl rounded-l-none border-l border-blue-300`}
									>
										<img
											src="/icons/weenus.svg"
											height={24}
											className="mr-2"
										/>
										WEENUS
									</button>
								</div>
								<p className="text-xs mt-2">
									Available Balance{' '}
									{(
										walletInfo.balance[token] /
										10 ** 18
									).toFixed(4)}
									{token === 'eth' ? ' rETH' : ' WEENUS'}
								</p>
							</section>
							<section className="mb-6">
								<label>Amount:</label>
								<input
									value={sendAmount.toFixed(4) || 0}
									onChange={e =>
										setSendAmount(parseInt(e.target.value))
									}
									className="rounded w-full mt-2 py-1 text-black text-center font-bold"
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
									placeholder="Type or Paste address"
									className="rounded w-full mt-2 py-2 px-2 text-black text-center font-bold text-sm placeholder-gray-200/30"
								/>
							</section>
							<Button
								onClick={() => prepareToSendTransaction()}
								classes="w-40 self-center"
								disabled={!sendAmount || !receiverAddress}
							>
								SUBMIT
							</Button>
						</>
					)}
					{pageStep === 'review' && (
						<div className="flex flex-col items-center">
							<h1 className="text-xl mb-8">Review Transaction</h1>
							<section className="mb-4 flex flex-col items-center">
								<p className="text-lg">SEND</p>
								<p>
									{sendAmount.toFixed(4)}
									{token === 'eth' ? ' rETH' : ' WEENUS'}
								</p>
							</section>
							<section className="flex flex-col mb-8">
								<p className="text-xs whitespace-nowrap">
									From: {walletInfo.account}
								</p>
								<img
									src="/icons/arrow-down.png"
									width={35}
									className="mx-auto my-8"
								/>
								<p className="text-xs whitespace-nowrap">
									To: {receiverAddress}
								</p>
							</section>
							<section className="flex w-2/3 justify-between">
								<p className="text-sm">Tx Fee:</p>
								<p className="text-sm">
									~ {(transactionFee / 10 ** 18).toFixed(6)}{' '}
									rBTC
								</p>
							</section>
							<div className="flex">
								<Button
									onClick={confirmTransaction}
									classes="w-40 mt-5 mr-4"
									disabled={!receiverAddress || !sendAmount}
								>
									CONFIRM
								</Button>
								<Button
									onClick={() => setPageStep('send')}
									classes="w-40 mt-5"
									secondary={true}
								>
									CANCEL
								</Button>
							</div>
						</div>
					)}
					{pageStep === 'details' && (
						<div className="flex flex-col items-center">
							<h1 className="text-2xl mb-6">
								Transaction Details
							</h1>
							<img
								src="/icons/check.svg"
								height={24}
								className=""
							/>
							<p className="text-gray-10">
								Status {transaction.status}
							</p>
							{transaction.transactionHash && (
								<div className="flex text-sm mt-6">
									<p className="mr-2">Tx Hash: </p>
									<p className="text-yellow-400">
										{transaction.transactionHash.slice(
											0,
											9
										) +
											'....' +
											transaction.transactionHash.slice(
												-9
											)}
									</p>
								</div>
							)}
							<Button
								onClick={() => setPageStep('send')}
								classes="w-40 mt-6"
								secondary={true}
							>
								CLOSE
							</Button>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default Home
