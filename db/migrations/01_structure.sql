--------------------------------------------------------------------------------
--- C L E A N U P --------------------------------------------------------------
--------------------------------------------------------------------------------


DROP TABLE IF EXISTS GlobalFilamentProperties;
DROP TABLE IF EXISTS ColorFilamentProperties;
DROP TABLE IF EXISTS UserFilamentProperties;
DROP TABLE IF EXISTS FilamentProperties;

DROP TABLE IF EXISTS FilamentSpools;
DROP TABLE IF EXISTS InventoryLocations;
DROP TABLE IF EXISTS PurchaseList;

DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Roles;

DROP TABLE IF EXISTS Barcodes;
DROP TABLE IF EXISTS Filaments;
DROP TABLE IF EXISTS Spools;
DROP TABLE IF EXISTS Brands;
DROP TABLE IF EXISTS Materials;


--------------------------------------------------------------------------------
-- U S E R   I N F O R M A T I O N ---------------------------------------------
--------------------------------------------------------------------------------


-- Each user that is known to the system has a role assigned to them that
-- outlines how different parts of the system act towards that user.
--
-- Each role has a numeric access level assigned to it, which is what is used to
-- actually control the role system; the lower the value, the higher the access
-- level.
CREATE TABLE IF NOT EXISTS Roles (
    roleId TEXT NOT NULL UNIQUE PRIMARY KEY,
    name TEXT NOT NULL,

    accessLevel INTEGER NOT NULL
);


--------------------------------------------------------------------------------


-- Each user that is known to the system is tracked by an entry in this table,
-- with their main information being managed by the Clerk Auth service.
--
-- In this table, unlike other tables, the userID is the Clerk assigned unique
-- UserID for a particular user, allowing entries in this table to directly
-- associate with the user in the session token that gets received.
--
-- Items are added to this table the first time a request arrives that contains
-- a Clerk user that does not exist in the table. Entries are otherwise
-- maintained by way of Web hooks that Clerk provides to tell us about additions,
-- updates and deletes (where we would treat the addition as a deferred update
-- since we created the entry right away).
--
-- This means that while our local user API pulls the data from here, it's
-- actually not editable from here except for the purposes of the role that is
-- applied to the user, which would require a call to a Clerk back end API to
-- update metadata.
CREATE TABLE IF NOT EXISTS Users (
    -- The Clerk userID; any user that we add by default is marked as a regular
    -- user.
    userId TEXT NOT NULL UNIQUE PRIMARY KEY,
    roleId TEXT NOT NULL REFERENCES Roles(roleId) DEFAULT('rVBBPOUWqPbWBmiUQuwGs'),

    -- Fundamental information about the user; we enforce that the name of the
    -- user and an email address must exist as a part of on-boarding, but the
    -- user is free to set a username or not and set a profile image or not.
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    username TEXT NOT NULL DEFAULT(''),
    profileImage TEXT NOT NULL DEFAULT(''),

    -- This information comes directly in the session token, and also in the
    -- web hooks; we can update
    createdAt DATE NOT NULL,
    updatedOn DATE NOT NULL,
    lastLogin DATE NOT NULL
);


--------------------------------------------------------------------------------
-- G L O B A L   I N F O R M A T I O N -----------------------------------------
--------------------------------------------------------------------------------


-- This table holds the global global list of all known filament brands.
CREATE TABLE IF NOT EXISTS Brands (
    brandId TEXT NOT NULL UNIQUE PRIMARY KEY,

    name TEXT UNIQUE NOT NULL,
    logo TEXT DEFAULT(''),
    homepage TEXT DEFAULT('')
);


CREATE UNIQUE INDEX idx_brand_names on Brands(name);


--------------------------------------------------------------------------------


-- This table holds the global global list of all known filament materials.
CREATE TABLE IF NOT EXISTS Materials (
    materialId TEXT NOT NULL UNIQUE PRIMARY KEY,

    name TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT('')
);


CREATE UNIQUE INDEX idx_material_names on Materials(name);


--------------------------------------------------------------------------------


-- This table holds the basic core information for a specific type of filament,
-- as described by its brand, material, color, diameter, and so on.
CREATE TABLE IF NOT EXISTS Filaments (
    filamentId TEXT NOT NULL UNIQUE PRIMARY KEY,
    brandId TEXT NOT NULL REFERENCES Brands(brandId),
    materialId TEXT NOT NULL REFERENCES Materials(materialId),

    image TEXT,

    spoolId TEXT NOT NULL REFERENCES Spools(spoolId),

    colorName TEXT NOT NULL,
    colorRGB TEXT NOT NULL,
    diameter FLOAT NOT NULL DEFAULT(1.75),

    reorderURL TEXT DEFAULT(null)
);


CREATE INDEX idx_filament_materials on Filaments(materialId);
CREATE INDEX idx_filament_brand_material on Filaments(brandId, materialId);


--------------------------------------------------------------------------------


-- This table holds the basic information on spools that can hold filament; each
-- can have a weight that they weigh with no filament on them, and can able be
-- marked as reusable, in which case the system will not discard them from a
-- user's inventory automatically.
CREATE TABLE IF NOT EXISTS Spools (
    spoolId TEXT NOT NULL UNIQUE PRIMARY KEY,
    brandId TEXT NOT NULL REFERENCES Brands(brandId),

    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT(''),
    image TEXT,

    -- How much this item weighs, in grams, when it has no filament on it.
    -- Conversely, how much weight of filament is contained for this item.
    --
    -- These values are used when determining how things are weighed out in
    -- order to estimate remaining filament.
    emptyWeightGrams INTEGER NOT NULL DEFAULT(0),
    initialFilamentWeightGrams INTEGER NOT NULL DEFAULT(1000),

    -- The spool can optionally be reusable, which means that when the filament
    -- runs out, the spool remains in the inventory of the user. It can also
    -- optionally be a refill, which means that in order to be usable, one would
    -- need to combine it with a spool that is marked as reusable.
    isReusable BOOL NOT NULL DEFAULT(0),
    isRefill BOOL NOT NULL DEFAULT(0),

    reorderURL TEXT DEFAULT(''),

    -- Both of these options are mutually exclusive, but not required; that is,
    -- a spool can be neither reusable nor a refill, but if it is one, it can
    -- only be one and not both.
    CONSTRAINT spool_exclusivity CHECK (
        NOT (isReusable = 1 AND isRefill = 1)
    )
);


CREATE INDEX idx_spool_names on Spools(name);
CREATE INDEX idx_reusable_spools on Spools(isReusable);
CREATE INDEX idx_refill_spools on Spools(isRefill);


--------------------------------------------------------------------------------


-- A list of product barcodes known to the system, and the filament or spool
-- that the apply to.

-- A barcode always associates with EITHER a specific filamentId, OR a specific
-- spoolId, but never both.

-- In the first case, the barcode is for products that are refills or filament
-- that ships directly on its own recyclable spool.
--
-- The second case is for things like Bambu reusable spools, which on their own
-- have a bar code that you can use to look them up.
--
-- The reason you can't have both is because something can't be a filament and a
-- spool at the same time.
CREATE TABLE IF NOT EXISTS Barcodes (
    barcode TEXT NOT NULL UNIQUE PRIMARY KEY,

    spoolId TEXT REFERENCES Spools(spoolId),
    filamentId TEXT REFERENCES Filaments(filamentId),

    -- The spoolId and filamentId fields are mutually exclusive, so exactly one
    -- of them needs to be non-null, but not both.
    CONSTRAINT barcode_target_mutual_exclusivity CHECK (
      (spoolId IS NOT NULL AND filamentId IS NULL) OR
      (spoolId IS NULL AND filamentId IS NOT NULL)
    )
);


--------------------------------------------------------------------------------
-- F I L A M E N T   C O N F I G U R A T I O N ---------------------------------
--------------------------------------------------------------------------------


-- This table defines the list of known filament properties that can exist in
-- the system, by name. Each parameter is given a specific type from a list of
-- known, allowable values.
--
-- The propertyId values from this table are used to populate the various
-- parameter tables, ensuring that all properties refer to the same thing.
CREATE TABLE IF NOT EXISTS FilamentProperties (
    propertyId TEXT NOT NULL UNIQUE PRIMARY KEY,

    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('text', 'int', 'float', 'bool', 'date', 'time', 'datetime'))
);

CREATE INDEX idx_filament_property_names on FilamentProperties(name);


--------------------------------------------------------------------------------

-- This table captures the global filament properties assigned to a specific
-- brand of filament of a particular material. This allows for a baseline set of
-- filament properties for a specific brand that carry across all of the
-- entries and works under the theory that the properties of, for example,
-- Bambu Labs Basic PLA, is largely the same for all PLA that they sell,
-- regardless of the color or other properties.
--
-- The goal here is to capture these in a material specific way in order to
-- reduce redundancy in the database.
CREATE TABLE GlobalFilamentProperties (
    brandId TEXT NOT NULL REFERENCES Brands(brandId),
    materialId TEXT NOT NULL REFERENCES Materials(materialId),
    propertyId TEXT NOT NULL REFERENCES FilamentProperties(propertyId),

    text_value TEXT DEFAULT(''),
    int_value INTEGER DEFAULT(0),
    float_value FLOAT DEFAULT(0.0),
    bool_value BOOLEAN DEFAULT(0),
    date_value DATE DEFAULT(''),
    time_value TIME DEFAULT(''),
    datetime_value DATETIME DEFAULT(''),

    PRIMARY KEY (brandId, materialId, propertyId)
);


--------------------------------------------------------------------------------

-- This table is an augment table to the GlobalFilamentProperties and allows for
-- color specific properties to be overridden on a case by case basis.
--
-- The theory here is that while all material of the same basic makeup from any
-- given brand probably performs the same, the materials added to alter the
-- color can potentially change properties, like requiring a harder nozzle or
-- a different nozzle temperature.
--
-- In practice when filament properties are gathered, this table and the global
-- table are combined together such that properties from this table that match
-- the global take precedence over the global properties.
CREATE TABLE ColorFilamentProperties (
    brandId TEXT NOT NULL REFERENCES Brands(brandId),
    materialId TEXT NOT NULL REFERENCES Materials(materialId),
    colorName TEXT NOT NULL,
    propertyId TEXT NOT NULL REFERENCES FilamentProperties(propertyId),

    text_value TEXT DEFAULT(''),
    int_value INTEGER DEFAULT(0),
    float_value FLOAT DEFAULT(0.0),
    bool_value BOOLEAN DEFAULT(0),
    date_value DATE DEFAULT(''),
    time_value TIME DEFAULT(''),
    datetime_value DATETIME DEFAULT(''),

    PRIMARY KEY (brandId, materialId, colorName, propertyId)
);


--------------------------------------------------------------------------------

-- This table is an augment to the GlobalFilamentProperties and
-- ColorFilamentProperties tables, and allows for any given user to override
-- settings on a specific  filament to whatever they might like.
--
-- Unlike the others, this uses a direct filamentId entry as it bypasses items
-- like the brand and material and focuses in directly on a specific filament.
-- The other tables use those values to reduce duplication across filament types
-- while user information is more targeted.
--
-- In practice when filament properties are gathered, the global and color
-- tables combine into one set of properties, and then properties from this
-- table are joined with it, allowing not only for user specific overrides but
-- also being able to see what the overridden value actually is.
CREATE TABLE UserFilamentProperties (
    userId TEXT NOT NULL REFERENCES Users(UserId),
    filamentId TEXT NOT NULL REFERENCES Filaments(filamentId),
    propertyId TEXT NOT NULL REFERENCES FilamentProperties(propertyId),

    text_value TEXT DEFAULT(''),
    int_value INTEGER DEFAULT(0),
    float_value FLOAT DEFAULT(0.0),
    bool_value BOOLEAN DEFAULT(0),
    date_value DATE DEFAULT(''),
    time_value TIME DEFAULT(''),
    datetime_value DATETIME DEFAULT(''),

    PRIMARY KEY (userId, filamentId, propertyId)
);


--------------------------------------------------------------------------------
-- U S E R   I N F O R M A T I O N ---------------------------------------------
--------------------------------------------------------------------------------


-- This table implements a simple inventory tagging system that allows a user
-- specific, fully open ended naming system to name inventory locations. Each
-- item that is owned by a user can be marked as being in one of the specific
-- locations.
CREATE TABLE IF NOT EXISTS InventoryLocations (
    inventoryId TEXT NOT NULL UNIQUE PRIMARY KEY,

    userId TEXT NOT NULL REFERENCES Users(UserId),

    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT(''),

    color TEXT NOT NULL,
    icon TEXT NOT NULL
);


CREATE INDEX idx_user_inventory_locations on InventoryLocations(userId, name);


--------------------------------------------------------------------------------


-- This table implements a wish list/purchase list of sorts that allows a
-- specific user to track the filaments and/or spools that they would like to
-- purchase more of. This can be auto-populated as a part of marking that a
-- specific filament is now fully used up as well as by an automated check that
-- adds more of a filament when its available level goes below a threshold.
CREATE TABLE IF NOT EXISTS PurchaseList (
    purchaseId TEXT NOT NULL UNIQUE PRIMARY KEY,

    userId TEXT NOT NULL REFERENCES Users(UserId),

    -- These two fields are mutually exclusive, since you either want to buy
    -- filament and it comes on a spool already, or you want to buy a reusable
    -- spool to put filament on later.
    spoolId TEXT REFERENCES Spools(spoolId),
    filamentId TEXT REFERENCES Filaments(filamentId),

    notes TEXT NOT NULL DEFAULT(''),

    count INTEGER NOT NULL DEFAULT(1),

    CONSTRAINT user_purchase_exclusivity CHECK (
        (spoolId IS NOT NULL AND filamentId IS NULL) OR
        (spoolId IS NULL AND filamentId IS NOT NULL)
    )
);


CREATE INDEX idx_user_filament_purchase_list on PurchaseList(userId, filamentId);
CREATE INDEX idx_user_spool_purchase_list on PurchaseList(userId, spoolId);


--------------------------------------------------------------------------------


-- This table tracks the user specific list of filaments and spools that a
-- specific user has at any given time. The entries here can contain either a
-- filament and a spoolId, or just a spoolId, depending on whether or not this
-- is tracking a specific kind of filament on a known spool type, or just an
-- empty reusable spool that currently has no filament on it.
--
-- For filament types that are reusable, there would be one entry for the empty
-- refill (known as the spool) and one entry for the refill filament (known as
-- the filament).
--
-- When the user wants to combine them, they would choose a reusable spool and
-- a refill refill filament entry would be removed and the entry for the
-- reusable spool would be adjusted to contain the filament.
--
-- This is why there are two sets of dates and prices; one is for the spool
-- side and one is for the filament side; when two are merged as mentioned
-- above, the spool entry gets the data from the filament copied into it.
--
-- Calculations on filament cost always come from the filament side of things.
CREATE TABLE IF NOT EXISTS FilamentSpools (
    filamentSpoolId TEXT NOT NULL UNIQUE PRIMARY KEY,

    userId TEXT NOT NULL REFERENCES Users(UserId),
    spoolId TEXT NOT NULL REFERENCES Spools(spoolId),
    filamentId TEXT REFERENCES Filaments(filamentId),

    inventoryId TEXT NULL REFERENCES InventoryLocations(inventoryId),

    notes TEXT NOT NULL DEFAULT(''),

    spoolPurchaseDate DATETIME NOT NULL DEFAULT(''),
    spoolPurchasePrice FLOAT NOT NULL DEFAULT(0.0),

    filamentPurchaseDate DATETIME DEFAULT(''),
    filamentPurchasePrice FLOAT DEFAULT(0.0),

    spoolEmptyWeightGrams INTEGER NOT NULL DEFAULT(0),
    spoolAdjustWeightGrams INTEGER NOT NULL DEFAULT(0),
    filamentWeightGrams INTEGER NOT NULL DEFAULT(0)
);


CREATE INDEX idx_user_spools on FilamentSpools(userId, spoolId, filamentId);
CREATE INDEX idx_user_filaments on FilamentSpools(userId, filamentId);


--------------------------------------------------------------------------------
