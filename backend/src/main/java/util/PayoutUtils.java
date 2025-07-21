/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package util;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.Transfer;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.TransferCreateParams;
import java.math.BigDecimal;
import java.math.RoundingMode;
import validation.EnvConfig;

/**
 *
 * @author anhkt
 */
public class PayoutUtils {

    public static String createConnectedAccount(String email) throws StripeException {
        EnvConfig configReader = new EnvConfig();

        if (Stripe.apiKey == null || Stripe.apiKey.isEmpty()) {
            Stripe.apiKey = configReader.getProperty("stripe_secret");
        }

        AccountCreateParams params = AccountCreateParams.builder()
                .setType(AccountCreateParams.Type.CUSTOM)
                .setCountry("US")
                .setEmail(email)
                .setBusinessType(AccountCreateParams.BusinessType.INDIVIDUAL)
                .setCapabilities(
                        AccountCreateParams.Capabilities.builder()
                                .setCardPayments(
                                        AccountCreateParams.Capabilities.CardPayments.builder()
                                                .setRequested(true)
                                                .build()
                                )
                                .setTransfers(
                                        AccountCreateParams.Capabilities.Transfers.builder()
                                                .setRequested(true)
                                                .build()
                                )
                                .build()
                )
                .build();

        Account account = Account.create(params);
        return account.getId();
    }
    
    public static boolean payoutToConnectedAccount(String connectedAccountId, int amountVND, String description) {
        try {
            EnvConfig configReader = new EnvConfig();

            if (Stripe.apiKey == null || Stripe.apiKey.isEmpty()) {
                Stripe.apiKey = configReader.getProperty("stripe_secret");
            }

            BigDecimal usdToVndRate = ExchangeRateUtil.getUsdToVndRate(); 
            BigDecimal amountUSD = BigDecimal.valueOf(amountVND).divide(usdToVndRate, 2, RoundingMode.DOWN);
            long amountUSDCents = amountUSD.multiply(BigDecimal.valueOf(100)).longValue();

            TransferCreateParams params = TransferCreateParams.builder()
                    .setAmount(amountUSDCents)
                    .setCurrency("usd")
                    .setDestination(connectedAccountId)
                    .setDescription(description)
                    .build();

            Transfer transfer = Transfer.create(params);
            return transfer != null;
        } catch (StripeException e) {
            e.printStackTrace();
            return false;
        }
    }
}
