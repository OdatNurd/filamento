--------------------------------------------------------------------------------
--- C L E A N U P --------------------------------------------------------------
--------------------------------------------------------------------------------


DROP TABLE IF EXISTS FilamentParameterMappings;
DROP TABLE IF EXISTS FilamentParameters;

DROP TABLE IF EXISTS FilamentSpools;
DROP TABLE IF EXISTS InventoryLocations;
DROP TABLE IF EXISTS PurchaseList;

DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Roles;

DROP TABLE IF EXISTS Barcodes;
DROP TABLE IF EXISTS Filaments;
DROP TABLE IF EXISTS FilamentBrands;
DROP TABLE IF EXISTS FilamentMaterials;
DROP TABLE IF EXISTS Spools;


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
    roleId TEXT UNIQUE PRIMARY KEY,
    name TEXT NOT NULL,

    accessLevel INTEGER NOT NULL
);


--------------------------------------------------------------------------------


-- Each user that is known to the system is tracked by an entry in this table.
--
-- Internally, each user has a unique nanoid identifier created for them at the
-- time they are added to the table.
--
-- Externally, we use Acheron as our authentication back end. Acheron supports
-- multiple authentication back ends, so the table here tracks the unique keys
-- that are provided to us, allowing for a potential mixed authentication system
-- to be used.
--
-- Currently the disambiguating factor is the Acheron information, which means
-- that logging in via different methods can cause the same user to appear twice
-- in the list even if their other details are the same. This is because not all
-- supported back ends guarantee the email address will be set.
--
-- Runtime support could be added to merge users together if it was known they
-- were the same user logging in via multiple methods.
CREATE TABLE IF NOT EXISTS Users (
    userId TEXT UNIQUE PRIMARY KEY,
    role TEXT NOT NULL REFERENCES Roles(roleId) DEFAULT('rVBBPOUWqPbWBmiUQuwGs'),

    acheronId TEXT NOT NULL,
    acheronProvider TEXT TEXT NOT NULL,

    name TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT(''),
    profileImage TEXT NOT NULL DEFAULT('')
);

-- We need to be able to look up a user not only by their ID, but also by the
-- external Acheron authentication method, so that we can cross associate the
-- two.
CREATE UNIQUE INDEX idx_auth_users on Users(acheronId, acheronProvider);


--------------------------------------------------------------------------------
-- G L O B A L   I N F O R M A T I O N -----------------------------------------
--------------------------------------------------------------------------------


-- This table holds the global global list of all known filament brands.
CREATE TABLE IF NOT EXISTS FilamentBrands (
    brandId TEXT UNIQUE PRIMARY KEY,

    name TEXT UNIQUE NOT NULL,
    homepage TEXT DEFAULT('')
);


CREATE UNIQUE INDEX idx_brand_names on FilamentBrands(name);


--------------------------------------------------------------------------------


-- This table holds the global global list of all known filament materials.
CREATE TABLE IF NOT EXISTS FilamentMaterials (
    materialId TEXT UNIQUE PRIMARY KEY,

    name TEXT UNIQUE NOT NULL
);


CREATE UNIQUE INDEX idx_material_names on FilamentMaterials(name);


--------------------------------------------------------------------------------


-- This table holds the basic core information for a specific type of filament,
-- as described by its brand, material, color, diameter, and so on.
CREATE TABLE IF NOT EXISTS Filaments (
    filamentId TEXT UNIQUE PRIMARY KEY,

    image TEXT DEFAULT(''),

    brandId TEXT NOT NULL REFERENCES FilamentBrands(brandId),
    materialId TEXT NOT NULL REFERENCES FilamentMaterials(materialId),
    color TEXT NOT NULL,
    diameter FLOAT NOT NULL DEFAULT(1.75),

    reorderURL TEXT DEFAULT(null)
);


CREATE INDEX idx_filament_brand_material on Filaments(brandId, materialId);


--------------------------------------------------------------------------------


-- This table holds the basic information on spools that can hold filament; each
-- can have a weight that they weigh with no filament on them, and can able be
-- marked as reusable, in which case the system will not discard them from a
-- user's inventory automatically.
CREATE TABLE IF NOT EXISTS Spools (
    spoolId TEXT UNIQUE PRIMARY KEY,

    brandId TEXT NULL REFERENCES FilamentBrands(brandId),

    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT(''),

    emptyWeightGrams INTEGER NOT NULL DEFAULT(0),

    -- Spools that are reusable in theory can be purchased, so they have a
    -- reorder URL. Spools that are disposable are not purchasable, so there will
    -- never be a reorder URL for them.
    reusable BOOL NOT NULL DEFAULT(0),
    reorderURL TEXT DEFAULT('')
);


CREATE INDEX idx_spool_info on Spools(name, reusable);


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
    code TEXT UNIQUE PRIMARY KEY,

    -- These two fields are mutually exclusive, since only one product can have
    -- a barcode of a specific value.
    filamentId TEXT REFERENCES Filaments(filamentId),
    spoolId TEXT REFERENCES Spools(spoolId)
);


--------------------------------------------------------------------------------
-- F I L A M E N T   C O N F I G U R A T I O N ---------------------------------
--------------------------------------------------------------------------------


-- This table implements an open ended filament parameter list that allows both
-- the system and specific users to apply any sort of user specific data they
-- would like to a filament.
CREATE TABLE IF NOT EXISTS FilamentParameters (
    parameterId TEXT UNIQUE PRIMARY KEY,

    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('text', 'int', 'float', 'bool', 'date', 'time', 'datetime')),

    text_value TEXT DEFAULT(''),
    int_value INTEGER DEFAULT(0),
    float_value FLOAT DEFAULT(0.0),
    bool_value BOOLEAN DEFAULT(0),
    date_value DATE DEFAULT(''),
    time_value TIME DEFAULT(''),
    datetime_value DATETIME DEFAULT('')
);

CREATE INDEX idx_parameter_names on FilamentParameters(name);


--------------------------------------------------------------------------------


-- Create a relational mapping between filament parameters and actual filaments.
--
-- Each mapping can either be global or user specific, depending on the value of
-- the given userId.
CREATE TABLE IF NOT EXISTS FilamentParameterMappings (
    mappingId TEXT UNIQUE PRIMARY KEY,

    -- userId can be null, in which case this mapping applies globally to all
    -- users; otherwise this mapping is for only that specific user, and can
    -- override parameters of the same name that are global.
    userId TEXT REFERENCES Users(UserId),
    filamentId TEXT NOT NULL REFERENCES Filaments(filamentId),
    parameterId TEXT NOT NULL REFERENCES FilamentParameters(parameterId)
);


CREATE INDEX idx_filament_parameter_mapping on FilamentParameterMappings(userId, filamentId, parameterId);


--------------------------------------------------------------------------------
-- U S E R   I N F O R M A T I O N ---------------------------------------------
--------------------------------------------------------------------------------


-- This table implements a simple inventory tagging system that allows a user
-- specific, fully open ended naming system to name inventory locations. Each
-- item that is owned by a user can be marked as being in one of the specific
-- locations.
CREATE TABLE IF NOT EXISTS InventoryLocations (
    inventoryId TEXT UNIQUE PRIMARY KEY,

    userId TEXT NOT NULL REFERENCES Users(UserId),
    name TEXT NOT NULL
);


CREATE INDEX idx_inventory_names on InventoryLocations(userId, name);


--------------------------------------------------------------------------------


-- This table implements a wishlist/purchase list of sorts that allows a
-- specific user to track the filaments and/or spools that they would like to
-- purchase more of. This can be auto-populated as a part of marking that a
-- specific filament is now fully used up as well as by an automated check that
-- adds more of a filament when its available level goes below a threshold.
CREATE TABLE IF NOT EXISTS PurchaseList (
    purchaseId TEXT UNIQUE PRIMARY KEY,

    userId TEXT NOT NULL REFERENCES Users(UserId),

    -- These two fields are mutually exclusive, since you either want to buy
    -- filament and it comes on a spool already, or you want to buy a reusable
    -- spool to put filament on later.
    filamentId TEXT REFERENCES Filaments(filamentId),
    spoolId TEXT REFERENCES Spools(spoolId),

    count INTEGER NOT NULL DEFAULT(1)
);


CREATE INDEX idx_user_filament_purchase_list on PurchaseList(userId, filamentId);
CREATE INDEX idx_user_spool_purchase_list on PurchaseList(userId, spoolId);


--------------------------------------------------------------------------------


-- This table tracks the user specific list of filaments and spools that a
-- specific user has at any given time. The entries hdere can contain either a
-- filament and a spoolId, or just a spoolId, depending on whether or not this
-- is tracking a specific kind of filament on a known spool type, or just an
-- empty reusable spool that currently has no filament on it.
CREATE TABLE IF NOT EXISTS FilamentSpools (
    filamentSpoolId TEXT UNIQUE PRIMARY KEY,

    userId TEXT NOT NULL REFERENCES Users(UserId),
    filamentId TEXT REFERENCES Filaments(filamentId),
    spoolId TEXT NOT NULL REFERENCES Spools(spoolId),

    inventoryId TEXT NULL REFERENCES InventoryLocations(inventoryId),

    notes TEXT NOT NULL DEFAULT(''),

    purchaseDate DATETIME NOT NULL DEFAULT(''),
    purchasePrice FLOAT NOT NULL DEFAULT(0.0),

    spoolAdjustWeightGrams INTEGER NOT NULL DEFAULT(0),
    filamentWeightGrams INTEGER NOT NULL DEFAULT(0)
);


CREATE INDEX idx_user_spools on FilamentSpools(userId, spoolId, filamentId);
CREATE INDEX idx_user_filaments on FilamentSpools(userId, filamentId);


--------------------------------------------------------------------------------
