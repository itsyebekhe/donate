document.addEventListener('DOMContentLoaded', function() {
            M.updateTextFields();
            fetchMinAmount();
        });

        function copyToClipboard(elementId) {
            var copyText = document.getElementById(elementId);
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand("copy");
            M.toast({html: 'کپی شد!'});
        }
        const cK = '82ce1a9549c4ee2d397adc7bc8bdfb5feb873d21ef3c076fe3ba1738bb788bf7';
        function fetchMinAmount() {
            const coinType = 'TRX';

            fetch(`https://api.changenow.io/v1/min-amount/${coinType.toLowerCase()}_trx?api_key=${cK}`)
                .then(response => response.json())
                .then(data => {
                    const minAmount = data.minAmount;
                    document.getElementById('minAmountLabel').textContent = `(حداقل: ${minAmount} TRX)`;
                })
                .catch(error => console.error('Error fetching the minimum amount:', error));
        }

        const trxWallet = 'TVcHD3KAoikaXmFnWUszFzVhu8PWd2w1T3'; 

        document.getElementById('donateForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const donateAmount = document.getElementById('donateInput').value;
            const minAmountLabel = document.getElementById('minAmountLabel').textContent;
            const minAmount = parseFloat(minAmountLabel.match(/\d+\.\d+|\d+/)[0]);

            if (donateAmount >= minAmount) {
                // Generate a payin address
                const url = "https://api.changenow.io/v2/exchange";
                const data = {
                    "fromCurrency": "trx",
                    "toCurrency": "trx",
                    "fromNetwork": "trx",
                    "toNetwork": "trx",
                    "fromAmount": donateAmount,
                    "toAmount": "",
                    "address": trxWallet,
                    "flow": "standard",
                    "type": "direct",
                    "useRateId": false
                };
                const headers = {
                    "Content-Type": "application/json",
                    "x-changenow-api-key": cK
                };
                fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(responseData => {
                    if (responseData.payinAddress) {
                        const payinAddress = responseData.payinAddress;
                        document.getElementById('payinAddress').value = payinAddress;
                        document.getElementById('payinAddressSection').style.display = 'block';
                    } else {
                        alert("An error occurred while generating the payin address.");
                    }
                })
                .catch(error => console.error('Error generating payin address:', error));
            } else {
                alert("The amount you entered is below the minimum required amount.");
            }
        });
