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
    ('swQgCxrubYVVFaccDiZGzH', 'Admin',     0),
    ('iJAylN6lqEiuVUWRr6r54z', 'SuperUser', 1),
    ('QoLObZchCZvLSKxcHDfOpP', 'User',      2)
  ;


-- Insert an initial user to be the administrator. Unless you're the person that
-- wrote this software, you probably want to change this if you run your own
-- version, unless you'd like OdatNurd to be an administrator on your site.
INSERT INTO Users(userId, roleId, name, email, username, profileImage, createdAt, updatedOn, lastLogin)
  VALUES
    (
      'user_2z3ed6I16IqupLEm40krnNOiWad',
      'swQgCxrubYVVFaccDiZGzH',
      'Terence Martin',
      'walts.dad@gmail.com',
      'odatnurd',
      'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yejNlZDcyQlhYeWsyc0RoR1FJUzRFanptWDAifQ',
      strftime('%FT%H:%M:%fZ', 1750964267, 'unixepoch', 'subsecond'),
      strftime('%FT%H:%M:%fZ', 1751492166, 'unixepoch', 'subsecond'),
      strftime('%FT%H:%M:%fZ', 1751475270, 'unixepoch', 'subsecond')
      )
    ;

--------------------------------------------------------------------------------


INSERT INTO Brands(brandId, name, homepage)
  VALUES
    ('LJXY88cPGBUEAXovycD2zv', '3DXTech', 'https://www.3dxtech.com/'),
    ('1QNOwIROZIOn8qQ5TqtD8W', 'Add:North', 'https://addnorth.com/'),
    ('7fk9YeQBWpBtJLeKoqW17w', 'Amolen', 'https://www.amolen.com/'),
    ('eLugANWbOUljlRytRtewdR', 'Atomic Filament', 'https://atomicfilament.com/'),
    ('hd38McWlwVaKicKJxDzU1S', 'AzureFilm', 'https://azurefilm.com/'),
    ('lLR1gFFmg0UpGvJxqpwTuJ', 'Bambu Lab', 'https://bambulab.com/'),
    ('NLJBb2QsEmkF9a5xpm4qbu', 'ColorFabb', 'https://colorfabb.com/'),
    ('tRppiEbNFSH8xwBgLQiA8O', 'eSUN', 'https://www.esun3d.com/'),
    ('DhWawf7zV8BKeJwjAbGVb2', 'Fiberlogy', 'https://fiberlogy.com/'),
    ('AnjhvU8ldQsJAnTgFr3Jf6', 'Fillamentum', 'https://fillamentum.com/'),
    ('uds9fEeoOodJgVt2ABYKQR', 'FormFutura', 'https://www.formfutura.com/'),
    ('4xXnOoPxUrOR6p03pjRv6q', 'Hatchbox', 'https://hatchbox3d.com/'),
    ('ogtFfRO2mRfeqSTCdGQgiZ', 'Inland', 'https://www.microcenter.com/site/content/inland.aspx'),
    ('m82S192ajBZ9HEvD1DuTuJ', 'KVP', 'https://www.villageplastics.com/'),
    ('ZR4HVux2LvGtPlldba7dCa', 'MatterHackers', 'https://www.matterhackers.com/'),
    ('PlwmAzvGxDHI6jkBnHnmpq', 'Polymaker', 'https://polymaker.com/'),
    ('6iSi86OwjiRFMm7DdPSy6y', 'Proto-pasta', 'https://www.proto-pasta.com/'),
    ('K7Do3uWsNvLw16cqsTIN02', 'Prusament', 'https://www.prusa3d.com/page/prusament_766/'),
    ('sn3tT2eTZ3OhIe2Fn6uxcr', 'Push Plastic', 'https://www.pushplastic.com/'),
    ('1BmTdHUJuSg3iFQ6pH8fI3', 'Spectrum Filaments', 'https://spectrumfilaments.com/'),
    ('J1D5ja3qLND3FcDAIElvqA', 'Sunlu', 'https://www.sunlu.com/'),
    ('rsJu0AMaR38EmOClf4batI', 'Taulman3D', 'https://taulman3d.com/'),
    ('0EVww2f7z4mrTWpcI19Qpp', 'Ultimaker', 'https://ultimaker.com/materials/')
  ;


INSERT INTO Materials(materialId, name, description)
  VALUES
    ('rv0ain17nSn4DO9gWwwOXg', 'PLA', 'Polylactic Acid'),
    ('M6lwuywKgv9BRKujdZWz9I', 'PLA Aero', 'Polylactic Acid'),
    ('nnXTAAXGCMgcCJctVf30bO', 'PLA Basic', 'Polylactic Acid'),
    ('IffsIQ1KCaz0ebR0DQPhWV', 'PLA Basic Gradient', 'Polylactic Acid'),
    ('u3sUoxujVgmYTC2VUkDq93', 'PLA Galaxy', 'Polylactic Acid'),
    ('PpNXeViZHCLyJwSiYIVJkB', 'PLA Glow', 'Polylactic Acid'),
    ('pdWnSh3T4e7iYBUexSsR4i', 'PLA Marble', 'Polylactic Acid'),
    ('aZ9INIQs2ZcgadJIbgARvr', 'PLA Matte', 'Polylactic Acid'),
    ('5PVHjNoGroiansFFcqtD1K', 'PLA Metal', 'Polylactic Acid'),
    ('xwhAueSXjXn8CGEUr1AeNv', 'PLA Silk', 'Polylactic Acid'),
    ('ihIQnhhOriqjIITEOx9Gis', 'PLA Silk Multi-Color', 'Polylactic Acid'),
    ('rFsROKZicwoJg1VCVdAem3', 'PLA Silk+', 'Polylactic Acid'),
    ('YOrCPlZ8c86SIW8oJqMS0T', 'PLA Sparkle', 'Polylactic Acid'),
    ('1vKrQ830s3SURs2GKsUL2E', 'PLA Translucent', 'Polylactic Acid'),
    ('2vFxgUukE4kaQ5fbrlt1p2', 'PLA Wood', 'Polylactic Acid'),
    ('IrcmBxwyczDWlOg7oeVJYu', 'PLA-CF', 'Polylactic Acid - Carbon Fibre'),

    ('sN9w2GEat9QoedBnHhXS08', 'PETG', 'Polyethylene Terephthalate Glycol'),
    ('tLqy53iY0hfV2emGP20Ioe', 'PETG Translucent', 'Polyethylene Terephthalate Glycol'),
    ('9qyA1Ytib2vZzEEpJrkoOO', 'PETG-CF', 'Polyethylene Terephthalate Glycol - Carbon Fibre'),
    ('wzAACvjlgt6NYMYExQk8Su', 'PETG-HF', 'Polyethylene Terephthalate Glycol - High Flow'),

    ('BGyjVCx8iO26wIF4oDyrF8', 'ABS', 'Acrylonitrile Butadiene Styrene'),
    ('PKe0X5MuqBzjVvtStxnpdl', 'ABS-GF', 'Acrylonitrile Butadiene Styrene - Glass Fibre'),

    ('wZaaqJ8PbL9atKDosT7fbW', 'ASA', 'Acrylonitrile Styrene Acrylate'),
    ('1UrqAPtst6UipXGux49dLr', 'ASA Aero', 'Acrylonitrile Styrene Acrylate'),
    ('YofjO0DVifJe56OtlDxMqI', 'ASA-CF', 'Acrylonitrile Styrene Acrylate - Carbon Fibre'),

    ('ow6RdhWh32s04Op1oOms4W', 'PC', 'Polycarbonate'),
    ('evyceFW6kr0oX3gBt7RO9m', 'PC FR', 'Polycarbonate - Flame Retardant'),

    ('bQfOeIbR8TJf7J7EiOK5vQ', 'TPU 85A', 'Thermoplastic Polyurethane'),
    ('jTqgap3M5j2K2EGKn8QWKT', 'TPU 90A', 'Thermoplastic Polyurethane'),
    ('JZ3UIb086iT7MLdgtSj6Ke', 'TPU 95A HF', 'Thermoplastic Polyurethane - High Flow'),
    ('UL2YUwi9GlhsT3pDOLdeS0', 'TPU for AMS', 'Thermoplastic Polyurethane'),

    ('fXbpz2yxuvubA6DkWRLcuv', 'PA6-CF', 'Nylon - Carbon Fibre'),
    ('TA0EyL9Tzg3EyavL4OryGq', 'PA6-GF', 'Nylon - Glass Fibre'),

    ('7bYybwx9v3NeJECuxWx85z', 'PAHT-CF', 'Polyamide - Carbon Fibre'),

    ('eSgvB9UXQf5WqGBtPegrQw', 'PET-CF', 'Polyethylene Terephthalate - Carbon Fibre'),

    ('7RAq0brWYCRKCyfh95vpBw', 'PPA-CF', 'Polyphthalamide - Carbon Fibre'),

    ('m2bvsy1IbHQl4uXZTuyfyo', 'PPS-CF', 'Polyphenylene Sulfide - Carbon Fibre'),

    ('t94d3UnYDLvNOMeCB47mza', 'PVA', 'Polyvinyl Alcohol'),
    ('WuP8qTFiDP0SnLG8vPK91e', 'Support for ABS', ''),
    ('4ciAsorjLsvyVAIzxBdkTH', 'Support for PA/PET', ''),
    ('uDvKWUZ8vVmpOa0ZhKzasA', 'Support for PLA/PETG', ''),
    ('1XaqJjZeTWPVqtblSrtjlN', 'Support for PLA (New)', '')
  ;


INSERT INTO Spools(spoolId, brandId, name, description, emptyWeightGrams, initialFilamentWeightGrams,
                   isReusable, isRefill, reorderURL)
  VALUES
    -- Actual weight of the cardboard spindle + the RFID tag is 29g, without
    -- accounting for potential moisture absorptions.
    ('Ya2jm2cuGHby5AVkUar75X', 'lLR1gFFmg0UpGvJxqpwTuJ',
     'Bambu Filament Refill', 'Bambu Filament on a Cardboard Spindle',
     29, 1000, 0, 1,
     ''),

    -- Actual weight of the spool is 216g, but the value here also factors in
    -- the weight of the cardboard spindle.
    ('WYjLSYrLViHA6wg4mtHqR6', 'lLR1gFFmg0UpGvJxqpwTuJ',
     'Bambu Reusable Spool', 'Reusable Spool; ABS Temp <= 70℃',
     216 + 29, 0, 1, 0,
     'https://ca.store.bambulab.com/products/bambu-reusable-spool'),

    -- Actual weight of the spool is 223g, but the value here also factors in the weight of the cardboard spindle.
    ('H3IcRpWuUysHTLsUxGoSbU', 'lLR1gFFmg0UpGvJxqpwTuJ',
     'Bambu Reusable Spool (High Temperature)', 'Reusable Spool; ABS+PC Temp <= 90℃',
     223 + 29, 0, 1, 0,
     'https://ca.store.bambulab.com/products/bambu-high-temperature-reusable-spool')
  ;


INSERT INTO Filaments(filamentId, brandId, materialId, image, spoolId, colorName, colorRGB, diameter, reorderURL)
  VALUES
    -- PLA Basic, Black, Bambu Labs, Refill
    ('99Vs5Xu3rJOuFQJAKnnfxD', 'lLR1gFFmg0UpGvJxqpwTuJ', 'nnXTAAXGCMgcCJctVf30bO',
     'https://store.bblcdn.com/s5/default/31f2cbb9d9bc473894322fa464ea63d2.png',
     'Ya2jm2cuGHby5AVkUar75X',
     'Black', '#000000',
     1.75,
     'https://ca.store.bambulab.com/products/pla-basic-filament?id=43766892298480'),

    -- PLA Basic, Black, Bambu Labs, Refill with Spool
    ('kWe9U64hAMdvQ0oCBFtsoj', 'lLR1gFFmg0UpGvJxqpwTuJ', 'nnXTAAXGCMgcCJctVf30bO',
     'https://store.bblcdn.com/s5/default/31f2cbb9d9bc473894322fa464ea63d2.png',
     'WYjLSYrLViHA6wg4mtHqR6',
     'Black', '#000000',
     1.75,
     'https://ca.store.bambulab.com/products/pla-basic-filament?id=43766892298480'),

    -- PLA Basic, Black, Bambu Labs, Refill with Spool (high temperature)
    ('UsCWtt1UE4Pq8cmBNdWjtC', 'lLR1gFFmg0UpGvJxqpwTuJ', 'nnXTAAXGCMgcCJctVf30bO',
     'https://store.bblcdn.com/s5/default/31f2cbb9d9bc473894322fa464ea63d2.png',
     'H3IcRpWuUysHTLsUxGoSbU',
     'Black', '#000000',
     1.75,
     'https://ca.store.bambulab.com/products/pla-basic-filament?id=43766892298480'),

    -- PLA Basic, Jade White, Bambu Labs, Refill
    ('TY3rtbtO1cFQgjlP96PsYW', 'lLR1gFFmg0UpGvJxqpwTuJ', 'nnXTAAXGCMgcCJctVf30bO',
     'https://store.bblcdn.com/s5/default/7970a11e9efd4d7bbf844311b4d762d0/White.jpg__op__resize,m_lfit,w_750__op__format,f_auto__op__quality,q_80',
     'Ya2jm2cuGHby5AVkUar75X',
     'Jade White', '#ffffff',
     1.75,
     'https://ca.store.bambulab.com/products/pla-basic-filament?id=43115681841392'),

    -- PLA Basic, Jade White, Bambu Labs, Refill with Spool
    ('rkrYCG6dtD2fI1URlaZUWV', 'lLR1gFFmg0UpGvJxqpwTuJ', 'nnXTAAXGCMgcCJctVf30bO',
     'https://store.bblcdn.com/s5/default/7970a11e9efd4d7bbf844311b4d762d0/White.jpg__op__resize,m_lfit,w_750__op__format,f_auto__op__quality,q_80',
     'WYjLSYrLViHA6wg4mtHqR6',
     'Jade White', '#ffffff',
     1.75,
     'https://ca.store.bambulab.com/products/pla-basic-filament?id=43115681841392'),

    -- PLA Basic, Jade White, Bambu Labs, Refill with Spool (high temperature)
    ('VFlpSUHfi1VJ5d6DiKKC9v', 'lLR1gFFmg0UpGvJxqpwTuJ', 'nnXTAAXGCMgcCJctVf30bO',
     'https://store.bblcdn.com/s5/default/7970a11e9efd4d7bbf844311b4d762d0/White.jpg__op__resize,m_lfit,w_750__op__format,f_auto__op__quality,q_80',
     'H3IcRpWuUysHTLsUxGoSbU',
     'Jade White', '#ffffff',
     1.75,
     'https://ca.store.bambulab.com/products/pla-basic-filament?id=43115681841392')
  ;


INSERT INTO Barcodes(barcode, spoolId, filamentId)
  VALUES
    -- PLA Basic, Black, Bambu Refill, on spool
    ('6975337031383', NULL, '99Vs5Xu3rJOuFQJAKnnfxD'),

    -- PLA Basic, White, Bambu Refill, on spool
    ('6975337031024', NULL, 'TY3rtbtO1cFQgjlP96PsYW'),

    -- PLA Basic, Black, Bambu Refill, no spool
    ('6975337031178', NULL, '99Vs5Xu3rJOuFQJAKnnfxD'),

    -- High Temperature Bambu Reusable Spool
    ('6975337038658', 'H3IcRpWuUysHTLsUxGoSbU', NULL)
  ;


--------------------------------------------------------------------------------

-- Insert some core properties that we can use in the test data
INSERT INTO FilamentProperties(propertyId, name, type)
  VALUES
    ('HzGePMl8rjYS93yhPq4svk', 'Nozzle Temp. Min', 'int'),
    ('KLBrnXRfNvhbVTP2PzsejA', 'Nozzle Temp. Max', 'int'),
    ('WlXQfGzVVtLoCIqP5ga3k5', 'Bed Temp. Min',    'int'),
    ('wz08HcQlO1pPOvEqwtbvc6', 'Bed Temp. Max',    'int'),
    ('9E2quY9u6Lho5sAh7MCSAy', 'Printing Speed',   'int'),
    ('pKa2C2QcoTYqFuZFoitoYD', 'Adhesive Suggested', 'bool')
  ;

-- Set some global properties for PLA Basic by Bambu Labs
INSERT INTO GlobalFilamentProperties(brandId, materialId, propertyId, int_value, bool_value)
  VALUES
    ('lLR1gFFmg0UpGvJxqpwTuJ', 'nnXTAAXGCMgcCJctVf30bO', 'HzGePMl8rjYS93yhPq4svk', 190, NULL),
    ('lLR1gFFmg0UpGvJxqpwTuJ', 'nnXTAAXGCMgcCJctVf30bO', 'KLBrnXRfNvhbVTP2PzsejA', 230, NULL),
    ('lLR1gFFmg0UpGvJxqpwTuJ', 'nnXTAAXGCMgcCJctVf30bO', 'WlXQfGzVVtLoCIqP5ga3k5', 35, NULL),
    ('lLR1gFFmg0UpGvJxqpwTuJ', 'nnXTAAXGCMgcCJctVf30bO', 'wz08HcQlO1pPOvEqwtbvc6', 45, NULL),
    ('lLR1gFFmg0UpGvJxqpwTuJ', 'nnXTAAXGCMgcCJctVf30bO', '9E2quY9u6Lho5sAh7MCSAy', 300, NULL),
    ('lLR1gFFmg0UpGvJxqpwTuJ', 'nnXTAAXGCMgcCJctVf30bO', 'pKa2C2QcoTYqFuZFoitoYD', NULL, 0)
  ;

-- Set up some color specific overrides; for our test purposes here we will say
-- that for Black the minimum temperature is higher and for white you should use
-- adhesive; not actually true as far as I know.
INSERT INTO ColorFilamentProperties(brandId, materialId, colorName, propertyId, int_value, bool_value)
  VALUES
    ('lLR1gFFmg0UpGvJxqpwTuJ', 'nnXTAAXGCMgcCJctVf30bO', 'Black', 'HzGePMl8rjYS93yhPq4svk', 200, NULL),
    ('lLR1gFFmg0UpGvJxqpwTuJ', 'nnXTAAXGCMgcCJctVf30bO', 'Jade White', 'pKa2C2QcoTYqFuZFoitoYD', NULL, 1)
  ;

-- The user can also provide filament specific  overrides that override both the
-- global and color properties.
--
-- For test purposes, adhesive is desirable for black, and the maximum nozzle
-- temperature is lower for white.
INSERT INTO UserFilamentProperties(userId, filamentId, propertyId, int_value, bool_value)
  VALUES
    ('user_2z3ed6I16IqupLEm40krnNOiWad', '99Vs5Xu3rJOuFQJAKnnfxD', 'pKa2C2QcoTYqFuZFoitoYD', NULL, 1),
    ('user_2z3ed6I16IqupLEm40krnNOiWad', 'TY3rtbtO1cFQgjlP96PsYW', 'wz08HcQlO1pPOvEqwtbvc6', 40, NULL)
  ;


--------------------------------------------------------------------------------


INSERT INTO InventoryLocations(inventoryId, userId, name, description, color, icon)
  VALUES
    ('pGLDM84QTau93c67DIABLS', 'user_2z3ed6I16IqupLEm40krnNOiWad',
     'Storage Box 1',
     'Main airtight filament container',
     'success', 'file-tray-full'),
    ('eQPgjskweDLa7a38MzieoP', 'user_2z3ed6I16IqupLEm40krnNOiWad',
     'Storage Box 2',
     'Secondary filament container',
     'success', 'file-tray-full'),
    ('HBiQkScDoHEhcMCgDMFO5z', 'user_2z3ed6I16IqupLEm40krnNOiWad',
     'AMS',
     'Bambu Labs AMS Unit',
     'tertiary', 'printer')
  ;


--------------------------------------------------------------------------------


INSERT INTO PurchaseList(purchaseId, userId, spoolId, filamentId, notes, count)
  VALUES
    -- Two Extra Basic Black Refill
    ('gI1goAucPx1xcKlCHFHIo2', 'user_2z3ed6I16IqupLEm40krnNOiWad',
      NULL, '99Vs5Xu3rJOuFQJAKnnfxD',
      'Running low on the last refill of our fallback utility color',
      2),

    -- Basic Jade White refills on spools,
    ('d7rI2RtG66nh3mN2K5FliX', 'user_2z3ed6I16IqupLEm40krnNOiWad',
      NULL, 'TY3rtbtO1cFQgjlP96PsYW',
      'Running low due to all of the wall hooks printed',
      1),

    -- 4 extra reusable spools
    ('QnfrV9weTotwBAtSdgunXt', 'user_2z3ed6I16IqupLEm40krnNOiWad',
      'H3IcRpWuUysHTLsUxGoSbU', NULL,
      'We are out of spools in case we buy new color refills',
      4)
  ;


--------------------------------------------------------------------------------


INSERT INTO FIlamentSpools(filamentSpoolId, userId, spoolId, filamentId, inventoryId, notes,
                           spoolPurchaseDate, spoolPurchasePrice,
                           filamentPurchaseDate, filamentPurchasePrice,
                           spoolEmptyWeightGrams,
                           spoolAdjustWeightGrams,
                           filamentWeightGrams)
  VALUES
    -- Bambu Labs BLack in the AMS
    ('dziZCGOfG37isJcfhpaAX4', 'user_2z3ed6I16IqupLEm40krnNOiWad',
      'WYjLSYrLViHA6wg4mtHqR6',
      '99Vs5Xu3rJOuFQJAKnnfxD',
      'HBiQkScDoHEhcMCgDMFO5z',
      'Utility filament',
      strftime('%FT%H:%M:%fZ', 1750964267, 'unixepoch', 'subsecond'),
      0.00,
      strftime('%FT%H:%M:%fZ', 1750964267, 'unixepoch', 'subsecond'),
      25.99,
      216 + 29,
      33,
      669),

    -- Bambu Labs White in the AMS,
    ('2DPghnlEDc8Xp6ZtG1nqK7', 'user_2z3ed6I16IqupLEm40krnNOiWad',
      'WYjLSYrLViHA6wg4mtHqR6',
      'TY3rtbtO1cFQgjlP96PsYW',
      'HBiQkScDoHEhcMCgDMFO5z',
      'Utility filament',
      strftime('%FT%H:%M:%fZ', 1750964267, 'unixepoch', 'subsecond'),
      0.00,
      strftime('%FT%H:%M:%fZ', 1750964267, 'unixepoch', 'subsecond'),
      25.99,
      216 + 29,
      33,
      987),

    -- White refill in storage location 1,
    ('D7KX6gAqCjfwhFUCktdzVQ', 'user_2z3ed6I16IqupLEm40krnNOiWad',
      'Ya2jm2cuGHby5AVkUar75X',
      'TY3rtbtO1cFQgjlP96PsYW',
      'pGLDM84QTau93c67DIABLS',
      '',
      strftime('%FT%H:%M:%fZ', 1750964267, 'unixepoch', 'subsecond'),
      0.00,
      strftime('%FT%H:%M:%fZ', 1750964267, 'unixepoch', 'subsecond'),
      25.99,
      29,
      0,
      1000),

    -- Reusable spool in storage location 2,
    ('zTxIIz9TqvMPWwmLa7tfsW', 'user_2z3ed6I16IqupLEm40krnNOiWad',
      'H3IcRpWuUysHTLsUxGoSbU',
      NULL,
      'eQPgjskweDLa7a38MzieoP',
      '',
      strftime('%FT%H:%M:%fZ', 1750964267, 'unixepoch', 'subsecond'),
      9.99,
      strftime('%FT%H:%M:%fZ', 1750964267, 'unixepoch', 'subsecond'),
      0.00,
      223,
      0,
      0)
  ;

--------------------------------------------------------------------------------
