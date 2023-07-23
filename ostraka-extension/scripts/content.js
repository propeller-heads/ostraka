const node_rpc = "https://goerli.optimism.io";
const contract_address = "0xaD16CF286d4ad219630F3C0890baa03F65Ad3d92";
const abi = [
    {
        "inputs": [
            {
                "internalType": "contract IWorldID",
                "name": "_worldId",
                "type": "address"
            },
            {
                "internalType": "contract IEAS",
                "name": "_eas",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "_schema_uid",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "AlreadyVoted",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "enum AuthType",
                "name": "authType",
                "type": "uint8"
            }
        ],
        "name": "AuthTypeNotFoundInVerifiedResult",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidProof",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ADDRESSES_PROVIDER_V2",
        "outputs": [
            {
                "internalType": "contract IAddressesProvider",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "APP_ID",
        "outputs": [
            {
                "internalType": "bytes16",
                "name": "",
                "type": "bytes16"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "IS_IMPERSONATION_MODE",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "SISMO_CONNECT_LIB_VERSION",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "config",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "bytes16",
                        "name": "appId",
                        "type": "bytes16"
                    },
                    {
                        "components": [
                            {
                                "internalType": "bool",
                                "name": "isImpersonationMode",
                                "type": "bool"
                            }
                        ],
                        "internalType": "struct VaultConfig",
                        "name": "vault",
                        "type": "tuple"
                    }
                ],
                "internalType": "struct SismoConnectConfig",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "content",
                "type": "string"
            }
        ],
        "name": "getVotingPool",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "positiveVotes",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "negativeVotes",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "content",
                        "type": "string"
                    }
                ],
                "internalType": "struct VotingPool",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "sismoConnectResponse",
                "type": "bytes"
            },
            {
                "internalType": "bytes",
                "name": "sismoMessage",
                "type": "bytes"
            },
            {
                "internalType": "address",
                "name": "worldcoinSignal",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "worldcoinRoot",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "worldCoinNullifierHash",
                "type": "uint256"
            },
            {
                "internalType": "uint256[8]",
                "name": "worldcoinProof",
                "type": "uint256[8]"
            }
        ],
        "name": "vote",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "attestation_id",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
let urlSegments = new URL(window.location.href).pathname.split('/').filter(segment => segment.length > 0);

// Check if the current URL is a tweet
if (window.location.href.includes('twitter.com') && urlSegments.length === 1) {

    let tweetUrl = window.location.href;
    console.log('Tweet URL:', tweetUrl);
    // TODO: Use tweetUrl to query your smart contract

    // Initialize a web3 instance with the provided RPC URL
    const web3 = new Web3(node_rpc);

    // Fetch the ABI from local JSON file

    const contract = new web3.eth.Contract(abi, contract_address);

    // Call the contract method
    contract.methods.getVotingPool(tweetUrl).call((err, result) => {
        if (err) {
            console.error('An error occurred:', err);
        } else {
            console.log(result);
            let overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.right = '20px';
            overlay.style.top = '20px';
            overlay.style.width = '250px';  // Set the width of the overlay
            overlay.style.height = '160px';  // Set the height of the overlay
            overlay.style.padding = '10px';
            overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            overlay.style.borderRadius = '5px';
            overlay.style.zIndex = 99999; // Make sure it appears on top of other elements
            overlay.style.color = 'white';  // Make the font color white
            overlay.style.fontWeight = 'bold';
            // overlay title
            let overlayTitle = document.createElement('h2');
            overlayTitle.textContent = 'Ostraka';

            // Create an image element for the icon
            fetch(chrome.runtime.getURL('images/icon-small.png'))
                .then((response) => response.blob())
                .then((blob) => {
                    let reader = new FileReader();
                    reader.onloadend = function () {
                        overlay.style.backgroundImage = 'url(' + reader.result + ')';  // Set the background image of the overlay
                        overlay.style.backgroundSize = 'cover';  // Cover the entire area of the overlay
                    }
                    reader.readAsDataURL(blob);
                });

            // Create elements to display the positive and negative votes
            let title = document.createElement('p');
            title.textContent = 'AUTHENTICITY VOTES:';
            title.style.fontFamily = 'Arial';  // Update the font
            overlay.appendChild(title);

            let positiveVotes = document.createElement('p');
            positiveVotes.textContent = 'Positive votes: ' + "7";
            positiveVotes.style.fontFamily = 'Arial';  // Update the font
            overlay.appendChild(positiveVotes);

            let negativeVotes = document.createElement('p');
            negativeVotes.textContent = 'Negative votes: ' + "5";
            negativeVotes.style.fontFamily = 'Arial';  // Update the font
            overlay.appendChild(negativeVotes);

            // Add the overlay to the page
            document.body.appendChild(overlay);
        }
    });
}
