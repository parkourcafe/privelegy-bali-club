# Other Bali 1.0 — owner release inputs

Date: 2026-07-18

This checklist contains only decisions and verified account/legal facts that
cannot be inferred from source code. Do not commit identity documents,
keystores, passwords, private keys or tax documents to Git.

## Action-time permissions

- [x] Allow Apple App ID/certificate/profile changes for Associated Domains and
      Apple Distribution.
- [x] Approve creation and secure backup of one shared Android app-signing key
      plus one separate Google Play upload key.
- [x] Allow uninstalling build 3 from the iPhone for a clean build-4 test.
- [x] Allow creation/merge of the release PR and production deployment.
- [ ] Decide whether the accidental duplicate Vercel project may be deleted.
- [ ] Store submission/publication is explicitly **not authorized** in the
      current task and remains a separate permission.

Once Apple signing is configured, the authorized local build command is
`OTHER_BALI_ALLOW_SIGNING=YES_I_HAVE_ACTION_TIME_AUTHORIZATION npm run ios:release:signed`.
Do not set that guard before the corresponding action-time permission is given.
The script uses Xcode Automatic signing with an Apple Development identity for
the archive, then Apple's cloud-managed distribution certificate during the
local `app-store-connect` export.
It allows Xcode to update provisioning for both steps but never uploads the
result. The exported IPA must still pass the release verifier as Apple
Distribution-signed with the exact `applinks:www.otherbali.com` entitlement.

## Store identity and contacts

- [ ] Legal person or entity responsible for the app.
- [ ] Copyright rights holder for `2026 …`.
- [ ] App Review contact name, monitored email and telephone number.
- [ ] Legal address and actual/contact address, country, and applicable
      tax/registration identifier for RuStore and other required storefronts.
- [ ] DSA trader/non-trader status and public trader contact fields, if the EU
      storefront is selected.

## Rights and privacy confirmations

- [ ] Confirm the legal basis/permissions for venue names, editorial text,
      photographs and other third-party content in every selected storefront.
- [ ] Confirm the Vercel agreement/DPA treats Vercel as a processor/service
      provider acting on the developer's instructions.
- [ ] Confirm who answers privacy/deletion requests sent to
      `support@otherbali.com` and test inbound delivery.
- [ ] Confirm the applicable privacy lawful basis and whether any additional
      consent UI is legally required.

## Google Play account facts

- [x] Personal developer account; Play Console currently blocks app creation
      and publication while the owner's identity appeal is pending.
- [x] Account created 8 July 2026. As a new personal account, it requires a
      closed test with at least 12 opted-in testers for 14 continuous days and
      a production-access review after the account itself is unblocked.
- [ ] Contact telephone verification. Play Console disables this step until
      Google's identity review/appeal is approved.
- [ ] Whether owner-device verification has been completed.
- [ ] Android developer identity and `com.otherbali.app` package registration
      status for Indonesia's 30 September 2026 deadline.

## Signing backup and console state

- [ ] Create and verify at least one independent encrypted off-device backup
      of both Android private keys. Local protected copies and Keychain
      passwords are verified, but no independent backup is currently proven.
- [x] RuStore contains an unpublished Other Bali draft. The exact signed APK
      has not been uploaded, and no publication action is authorized.
- [ ] Configure Play App Signing by importing the prepared shared app-signing
      key and registering the separate upload certificate after Google unlocks
      app creation. No Play app or track exists yet.

## Final content decisions

- [ ] Keep bar/wine/cocktail references and accept RuStore **18+**, or remove
      those references from the exact production catalogue before capture and
      submission.
- [ ] Confirm App Store primary locale `English (U.S.)`.
- [ ] Confirm Google target audience `18 and over` and no child age groups.
- [ ] Confirm Apple export-compliance answers for the exact signed binary.
