import React, { useEffect, useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import githubLogo from './assets/github-logo.svg';
import { ethers } from 'ethers';
import myEpicNft from './utils/MyEpicNFT.json';

const twitter_HANDLE = 'https://twitter.com/rahulkarda';
const twitter_LINK = `https://twitter.com/rahulkarda`;
const OPENSEA_LINK = 'https://testnets.opensea.io/assets?search[query]=0xe268f9CCCbD2b33b0bE046Cd440186f9F0965F71';
const TOTAL_MINT_COUNT = 2500;

const App = () => {
	const [currentAccount, setCurrentAccount] = useState('');

	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			console.log('Make sure you have metamask!');
			return;
		} else {
			console.log('We have the ethereum object', ethereum);
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' });

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
			setCurrentAccount(account);
		} else {
			console.log('No authorized account found');
		}
	};

	/*
  * Implement your connectWallet method here
  */
	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert('Get MetaMask!');
				return;
			}

			/*
      * Fancy method to request access to account.
      */
			const accounts = await ethereum.request({
				method: 'eth_requestAccounts'
			});

			/*
      * Boom! This should print out public address once we authorize Metamask.
      */
			console.log('Connected', accounts[0]);
			setCurrentAccount(accounts[0]);
			setupEventListener();
		} catch (error) {
			console.log(error);
		}
	};
	// Setup our listener.
	const setupEventListener = async () => {
		// Most of this looks the same as our function askContractToMintNft
		try {
			const { ethereum } = window;

			if (ethereum) {
				// Same stuff again
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const connectedContract = new ethers.Contract(
					CONTRACT_ADDRESS,
					myEpicNft.abi,
					signer
				);

				// THIS IS THE MAGIC SAUCE.
				// This will essentially "capture" our event when our contract throws it.
				// If you're familiar with webhooks, it's very similar to that!
				connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
					console.log(from, tokenId.toNumber());
					alert(
						`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
					);
				});

				console.log('Setup event listener!');
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};
	// Render Methods
	const renderNotConnectedContainer = () => (
		<button
			onClick={connectWallet}
			className="cta-button connect-wallet-button"
		>
			Connect to Wallet
		</button>
	);

	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);


  
	const askContractToMintNft = async () => {
		const CONTRACT_ADDRESS = '0xe268f9CCCbD2b33b0bE046Cd440186f9F0965F71';

		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const connectedContract = new ethers.Contract(
					CONTRACT_ADDRESS,
					myEpicNft.abi,
					signer
				);
    
				console.log('Connecting MetaMask to Mint NFT...');
        document.querySelector(
					'#mining'
				).innerHTML = 'Connecting MetaMask to Mint NFT...';
				let nftTxn = await connectedContract.makeAnEpicNFT();
				document.querySelector('#mining').innerHTML =
					'Minting NFT...please wait.';
				console.log('Minting NFT...please wait.');
				await nftTxn.wait();
        const rinkebyLink = `https://rinkeby.etherscan.io/tx/${
						nftTxn.hash}`;
				console.log(
					`NFT minted, see transaction: https://rinkeby.etherscan.io/tx/${
						nftTxn.hash
					}`
				);
				// document.querySelector(
				// 	'#mining'
				// ).innerHTML = `NFT minted, see transaction: https://rinkeby.etherscan.io/tx/${
				// 	nftTxn.hash}`;
				// document.getElementById('mining').addEventListener('click', open);
				// function open() {
				// 	window.open(`https://rinkeby.etherscan.io/`, '_blank');
				// }
        document.querySelector(
					'#mining'
				).innerHTML = '';
        let mydiv = document.getElementById("mining");
let aTag = document.createElement('a');
aTag.setAttribute('href',`${rinkebyLink}`);
        aTag.setAttribute('target','_blank');
aTag.innerText = "NFT minted, click to see transaction on Etherscan";
mydiv.appendChild(aTag);
        
        document.querySelector('#opensealink').innerHTML = `View collection on OpenSea`;
        document.getElementById('opensealink').addEventListener('click', go);
				function go() {
					window.open('https://testnets.opensea.io/assets?search[query]=0xe268f9CCCbD2b33b0bE046Cd440186f9F0965F71', '_blank');
				}
        
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};
	const renderMintUI = () => {
		<div>
			<button
				onClick={askContractToMintNft}
				className="cta-button connect-wallet-button"
			>
				Mint NFT
			</button>
			<br />
			<br />
			<a
				href={`https://testnets.opensea.io/${currentAccount}`}
				style={{ color: 'white' }}
			>
				Check your NFTs
			</a>
		</div>;
	};

	/*
  * Added a conditional render! We don't want to show Connect to Wallet if we're already conencted :).
  */
	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<p className="header gradient-text">My NFT Collection</p>
					<p className="sub-text">
						Each unique. Each Beautiful. Discover some cool NFTs today.
					</p>
					{currentAccount === '' ? (
						renderNotConnectedContainer()
					) : (
						<button
							onClick={askContractToMintNft}
							className="cta-button connect-wallet-button"
						>
							Mint NFT
						</button>
					)}
				</div>
				<div id="mining" />
				<div id="opensealink">
          
        </div>
				<div className="footer-container">
         <p>Designed by Rahul Karda</p>
					<a href="https://github.com/rahulkarda" target="_blank">
						<i className="fa-brands fa-github" />
					</a>
			</div>
		</div>
      </div>
    );

};

export default App;
