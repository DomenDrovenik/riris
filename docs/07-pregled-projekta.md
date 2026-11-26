# Pregled projekta

Pregled prevzetega projekta ServisDesk: katere MVP funkcionalnosti so implementirane in ali zadoščajo izbranim uporabniškim zgodbam.

Legenda: ✅ implementirano, ⚠️ delno implementirano, ❌ ni implementirano

## MVP funkcionalnosti

| MVP funkcionalnost | Stanje | Opomba |
|---|---|---|
| Registracija in prijava uporabnika | ✅ | JWT avtentikacija, gesla zgoščena z bcrypt, dostop omejen glede na vlogo. |
| Ustvarjanje novega servisnega zahtevka | ✅ | Obrazec z validacijo na frontendu in backendu. |
| Pregled servisnih zahtevkov | ✅ | Stranka vidi svoje, serviser dodeljene, administrator vse zahtevke. |
| Dodelitev zahtevka serviserju | ✅ | Administrator izbere serviserja, status se spremeni v `ASSIGNED`. |
| Spreminjanje statusa zahtevka | ✅ | Dovoljeni so le pravilni prehodi glede na vlogo. |
| Dodajanje komentarjev k zahtevku | ⚠️ | Komentarji se shranijo v bazo, vendar se v aplikaciji nikjer ne prikažejo. |
| Vnos rešitve in označitev kot rešeno (serviser) | ✅ | Zaključni komentar je obvezen. |
| Zaključek rešenega zahtevka (administrator) | ✅ | Prehod `RESOLVED → CLOSED`. |

Glavni potek obravnave zahtevka (`NEW → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED`) deluje v celoti. Manjka predvsem prikaz zgodovine zahtevka: zapisi v tabeli `service_history` ne vsebujejo starega in novega statusa, ustvarijo pa se samo, če je dodan komentar.

## Pregled uporabniških zgodb

| Uporabniška zgodba | Zadošča | Opomba |
|---|---|---|
| US-01 – Registracija in prijava | ✅ | Vsi kriteriji izpolnjeni. Manjkata le gumb za odjavo in povezava na prijavo z domače strani. |
| US-02 – Ustvarjanje servisnega zahtevka | ✅ | Vsi kriteriji izpolnjeni. |
| US-07 – Dodelitev zahtevka serviserju | ⚠️ | Dodelitev deluje, v zgodovino pa se zapiše le, če administrator doda komentar. |
| US-10 – Dodajanje komentarjev | ⚠️ | Komentar se shrani z uporabnikom in časom, ni pa viden v zgodovini zahtevka. |
| US-12 – Označitev zahtevka kot rešenega | ⚠️ | Pravila (samo dodeljeni serviser, samo iz `IN_PROGRESS`, obvezen komentar) delujejo, sprememba statusa pa se ne zabeleži v zgodovino. |

## Zaključek

Implementirane funkcionalnosti pokrivajo glavni MVP potek in večino kriterijev izbranih uporabniških zgodb. Za popolno skladnost manjka beleženje sprememb statusa v zgodovino in prikaz zgodovine zahtevka (s tem povezana tudi US-15). Funkcionalnosti izven MVP (fotografije, e-poštna obvestila, filtriranje po statusu) še niso implementirane.
