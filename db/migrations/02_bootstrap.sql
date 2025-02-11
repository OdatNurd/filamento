--------------------------------------------------------------------------------
-- D A T A   B O O T S T R A P P I N G -----------------------------------------
--------------------------------------------------------------------------------


-- Set up a distinct list of known roles in the system.
--   * "admin" has full site admin rights
--   * "superuser" is as a regular user, but with some extra privileges like
--                 having an account that does not expire.
--   * "user" is a regular user
-- Set up the distinct list of known roles in the system.
INSERT INTO Roles(roleId, name, accessLevel)
  VALUES
    ('SctYBZqwLgiuNgZgkATsZ', 'admin',     0),
    ('NJYiqxe2rkiFuAmu3DJDD', 'superuser', 1),
    ('rVBBPOUWqPbWBmiUQuwGs', 'user',      2)
  ;


-- Insert an initial user to be the administrator. Unless you're the person that
-- wrote this software, you probably want to change this if you run your own
-- version, unless you'd like OdatNurd to be an administrator on your site.
INSERT INTO Users(userId, role, acheronId, acheronProvider, name, email, profileImage )
  VALUES
    ('XHmX-SwOs-r-CVfbFpDq3', 'SctYBZqwLgiuNgZgkATsZ',
        'google-oauth2|109350420655042271173', 'auth0',
        'odatnurd', 'odatnurd@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocIe0mPwlIlqv2c85uUtYhsIBG94kLg4HFWDmFf2jPwr8w6f6hPf=s96-c')
    ;


--------------------------------------------------------------------------------


INSERT INTO FilamentBrands(brandId, name, homepage)
  VALUES
    ('5gkPoGB-bsk_xtaCAlYKz', 'Bambu Labs', 'https://bambulab.com/')
  ;

INSERT INTO FilamentMaterials(materialId, name)
  VALUES
    ('JUQw5GdDNk_zWafvIrLRR', 'PLA Basic'),
    ('ysx2lBqIlBejCqFz26c2b', 'PLA Silk+'),
    ('3PfahgmpuWVNbQ2tml-Xk', 'PETG'),
    ('YmOs13GibiQK2SOq_1BDe', 'ASA'),
    ('713OTFwPuNmyYt72K5rgr', 'TPU')
  ;

INSERT INTO Filaments(filamentId, image, brandId, materialId, color, diameter, reorderURL)
  VALUES
    -- PLA Basic, Black, Bambu Labs
    ('yh3vhxJuMqv-OazNd6BD5', 'https://store.bblcdn.com/s5/default/31f2cbb9d9bc473894322fa464ea63d2.png', '5gkPoGB-bsk_xtaCAlYKz', 'JUQw5GdDNk_zWafvIrLRR', 'Black', 1.75, 'https://ca.store.bambulab.com/products/pla-basic-filament?id=43766892298480'),

    -- PLA Basic, Jade White, Bambu Labs
    ('swmUPd2uxzXhtotJDMzw8', 'https://store.bblcdn.com/s5/default/7970a11e9efd4d7bbf844311b4d762d0/White.jpg__op__resize,m_lfit,w_750__op__format,f_auto__op__quality,q_80', '5gkPoGB-bsk_xtaCAlYKz', 'JUQw5GdDNk_zWafvIrLRR', 'Jade White', 1.75, 'https://ca.store.bambulab.com/products/pla-basic-filament?id=43115681841392')
  ;

INSERT INTO Spools(spoolId, brandId, name, description, emptyWeightGrams, reusable, reorderURL)
  VALUES
    -- Actual weight of the cardboard spindle + the rfid tag is 29g
    ('1lHaAWa2M8XR25g9SBcWW', '5gkPoGB-bsk_xtaCAlYKz', 'Bambu Refill', 'Bambu Filament Refill', 29, 0, ''),

    -- Actual weight of the spool is 216g, but the value here also factors in the weight of the cardboard spindle.
    ('hoJoywe1Uj7MAkPQrItL5', '5gkPoGB-bsk_xtaCAlYKz', 'Bambu Reusable', 'ABS Temp <= 70℃', 245, 1, 'https://ca.store.bambulab.com/products/bambu-reusable-spool'),

    -- Actual weight of the spool is 223g, but the value here also factors in the weight of the cardboard spindle.
    ('c-48y5CIebKYdovx9nUCr', '5gkPoGB-bsk_xtaCAlYKz', 'Bambu Reusable (High Temperature)', 'ABS+PC Temp <= 90℃', 252, 1, 'https://ca.store.bambulab.com/products/bambu-high-temperature-reusable-spool')
  ;

INSERT INTO Barcodes(code, filamentId, spoolId)
  VALUES
    -- PLA Basic, Black, on spool
    ('6975337031383', 'yh3vhxJuMqv-OazNd6BD5', NULL),

    -- PLA Basic, White, Bambu Refill, on spool
    ('6975337031024', 'swmUPd2uxzXhtotJDMzw8', NULL),

    -- PLA Basic, Black, Bambu Refill
    ('6975337031178', 'yh3vhxJuMqv-OazNd6BD5', NULL),

    -- It goes without saying (one hopes) that the barcode here is a fake
    -- placeholder since I don't have access to the packaging for this at the
    -- moment.
    --
    -- High Temperature Bambu Reusable Spool
    ('1234567890123', NULL, 'c-48y5CIebKYdovx9nUCr')
  ;


--------------------------------------------------------------------------------


-- Some simple test parameters for Bambu PLA Basic Black
INSERT INTO FilamentParameters(parameterId, name, type, int_value)
  VALUES
    ('YXg88pps7mkPyq4yvesIr', 'Nozzle Temp. Min', 'int', 190),
    ('Qx_ACu2hixU8gnbVYdCcd', 'Nozzle Temp. Max', 'int', 230),
    ('X0Zl8M68v73jzySZpT4L0', 'Bed Temp. Min',    'int', 35),
    ('jebfwIVq_F550R6VU9xLm', 'Bed Temp. Max',    'int', 45),
    ('2oBsLSwXddUJ3qKm_wg8V', 'Printing Speed',   'int', 300)
  ;


-- Mapping all of the above to PLA Basic Black and PLA Basic White
--
-- Here the two filaments are sharing the same filament parameter; this allows
-- a new filament to be set up as having the same properties as an existing one
-- by just gathering all of the entries for a base filament and then re-entering
-- them.
--
-- This would operate as COPY-ON-WRITE; when a modification is mode to a param,
-- create a new parameter for the new value and update the mapping record,
-- making sure to clean up the old one if it's no longer used (or if it's only
-- used once, just modify it in place maybe?)
INSERT INTO FilamentParameterMappings(mappingId, filamentId, parameterId)
  VALUES
    -- Bambu Basic Black PLA
    ('jBQuSOe7lcCa6TpYbbcEP', 'yh3vhxJuMqv-OazNd6BD5', 'YXg88pps7mkPyq4yvesIr'),
    ('hhb75G-6jAWjFAW_5rEpm', 'yh3vhxJuMqv-OazNd6BD5', 'Qx_ACu2hixU8gnbVYdCcd'),
    ('siaff5yzGbAEMJLjKe0Qr', 'yh3vhxJuMqv-OazNd6BD5', 'X0Zl8M68v73jzySZpT4L0'),
    ('6PPEHiE_OS0leb1nVGpe1', 'yh3vhxJuMqv-OazNd6BD5', 'jebfwIVq_F550R6VU9xLm'),
    ('WscAJAsqfjqKdDahPuDf-', 'yh3vhxJuMqv-OazNd6BD5', '2oBsLSwXddUJ3qKm_wg8V'),

     -- Bambu Basic White PLA
    ('gzwRxFHEiTS3vhXa0ewo6', 'swmUPd2uxzXhtotJDMzw8', 'YXg88pps7mkPyq4yvesIr'),
    ('SVAXRtxfOshTd14vyoHRd', 'swmUPd2uxzXhtotJDMzw8', 'Qx_ACu2hixU8gnbVYdCcd'),
    ('mhzDEomHDAPWuBUKmK3vQ', 'swmUPd2uxzXhtotJDMzw8', 'X0Zl8M68v73jzySZpT4L0'),
    ('s04Hj5vpA7EwDcYKaYOoA', 'swmUPd2uxzXhtotJDMzw8', 'jebfwIVq_F550R6VU9xLm'),
    ('LQy2pj6XG3GzxdLfSsxr8-', 'swmUPd2uxzXhtotJDMzw8', '2oBsLSwXddUJ3qKm_wg8V')
  ;


--------------------------------------------------------------------------------


INSERT INTO InventoryLocations(inventoryId, userId, name)
  VALUES
    ('5UNjY6Jlckl9bN_cFnzz9', 'XHmX-SwOs-r-CVfbFpDq3', 'Storage Box 1'),
    ('kdgGXhsaAeci-RaQA0GHl', 'XHmX-SwOs-r-CVfbFpDq3', 'Storage Box 2'),
    ('vl30Ke5n2GMcNVn8SQ075', 'XHmX-SwOs-r-CVfbFpDq3', 'AMS')
  ;


--------------------------------------------------------------------------------


INSERT INTO PurchaseList(purchaseId, userId, filamentId, spoolId, count)
  VALUES
    -- Bambu Labs Basic Black PLA
    ('ojQ5DvnuGXaX79kvuq1Ra', 'XHmX-SwOs-r-CVfbFpDq3', 'yh3vhxJuMqv-OazNd6BD5', NULL, 2),
    ('mgLnH_dnBE15rO4MGgIIz', 'XHmX-SwOs-r-CVfbFpDq3', NULL, 'c-48y5CIebKYdovx9nUCr', 69)
  ;


--------------------------------------------------------------------------------


INSERT INTO FilamentSPools(filamentSpoolId, userId, filamentId, spoolId, inventoryId, filamentWeightGrams)
  VALUES
    -- Bambu Labs Basic Black PLA in the AMS
    ('lLaoV5rmJkPkVMKtEQsaG', 'XHmX-SwOs-r-CVfbFpDq3', 'yh3vhxJuMqv-OazNd6BD5', 'hoJoywe1Uj7MAkPQrItL5', 'XHmX-SwOs-r-CVfbFpDq3', 750),

    -- Bambu Labs Basic White PLA in box 1 (refill)
    ('OgCRmrGn_QEN96n1E8tFI', 'XHmX-SwOs-r-CVfbFpDq3', 'swmUPd2uxzXhtotJDMzw8', '1lHaAWa2M8XR25g9SBcWW', 'XHmX-SwOs-r-CVfbFpDq3', 1000),

    -- Bambu Labs reusable spool in box 2
    ('Y60HLI1LIqRchYmWQ7Zvv', 'XHmX-SwOs-r-CVfbFpDq3', NULL, 'c-48y5CIebKYdovx9nUCr', 'XHmX-SwOs-r-CVfbFpDq3', 0)
  ;


--------------------------------------------------------------------------------
