- System Architecture with Revenue Engine

## ┌──────────────────────────────────────────────────────────────────────────
## ───┐
│                           CLIENT LAYER                                       │
## │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
## │
│  │   iOS App   │  │ Android App │  │    Web App  │  │  Admin/B2B  │          │
│  │  (SwiftUI)  │  │   (Kotlin)  │  │  (React)    │  │   Portal    │          │
## │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
## │
## │         └─────────────────┴─────────────────┘            │                  │
## │                           │                              │                  │
## └───────────────────────────┼──────────────────────────────┼───────────────
## ───┘
## │                              │
## ┌───────────────────────────┼──────────────────────────────┼───────────────
## ───┐
│                    API GATEWAY (Kong/AWS API GW)                              │
│              Rate Limiting │ Auth │ SSL │ Revenue Validation                  │
## └───────────────────────────┼──────────────────────────────┼───────────────
## ───┘
## │                              │
## ┌───────────────────────────┼──────────────────────────────┼───────────────
## ───┐
│                     MICROSERVICES LAYER                                       │
## │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌───────────┐
## │
## │  │   Auth     │ │   Event    │ │   Media    │ │   User     │ │  Revenue  │ │
## │  │  Service   │ │  Service   │ │  Service   │ │  Service   │ │  Engine   │ │
│  │  (Node.js) │ │  (Node.js) │ │   (Go)     │ │  (Node.js) │ │ (Node.js) │ │
## │  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬─────┘
## │
## │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌───────────┐
## │
│  │   Live     │ │  Search    │ │  Friend    │ │  Payment   │ │  B2B/     │ │
## │  │  Streaming │ │  Service   │ │  Service   │ │  Service   │ │  White    │ │
│  │   (Go)     │ │ (Node.js)  │ │ (Node.js)  │ │ (Node.js)  │ │  Label    │ │
## │  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬─────┘
## │
## │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌───────────┐
## │
## │  │  Export    │ │  Storage   │ │  Partner   │ │ Enterprise │ │ Analytics │ │
│  │  Service   │ │  Manager   │ │  Integr.   │ │  Service   │ │  (Internal)│ │
│  │   (Go)     │ │   (Go)     │ │  (Node.js) │ │ (Node.js)  │ │ (ClickHouse)│
## │  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬─────┘
## │
## │
## └─────────────────┴─────────────────┴─────────────────┴─────────────┘
│                              │                                               │
## └──────────────────────────────┼───────────────────────────────────────────
## ────┘
## │
## ┌──────────────────────────────┼───────────────────────────────────────────

## ────┐
│                     DATA & STORAGE LAYER                                        │
## │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
## │
│  │PostgreSQL  │ │    S3      │ │   Redis    │ │Elasticsearch│ │   Kafka    │ │
│  │ (Primary)  │ │  (Media)   │ │  (Cache)   │ │  (Search)   │ │ (Events)   │ │
│  │ + Revenue  │ │ + Tiers    │ │ + Billing  │ │             │ │ + Revenue  │ │
│  │   Schema   │ │            │ │   State    │ │             │ │   Events   │ │
## │  └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘
## │
## │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
## │
│  │ ClickHouse │ │   MinIO    │ │  Stripe    │ │   Vault    │ │  Partner   │ │
│  │ (Revenue   │ │ (Cold/     │ │  Connect   │ │  (Secrets) │ │   DB       │ │
## │  │  Analytics)│ │  Archive)  │ │  + Webhooks│ │            │ │            │ │
## │  └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘
## │
## └──────────────────────────────────────────────────────────────────────────
## ───────┘
- Revenue Engine Service (Core)

## // /services/revenue/src/

├── controllers
## /

│   ├── purchaseController
.ts           // Event upgrades, storage, exports

│   ├── entitlementController
.ts        // Check access rights

│   ├── pricingController
.ts              // Dynamic pricing, regional

│   └── webhookController
.ts              // Stripe/payment webhooks

├── services
## /

│   ├── entitlementService
.ts             // Feature gating engine

│   ├── pricingEngine
.ts                  // SKU management, discounts

│   ├── purchaseFlow
.ts                   // Checkout orchestration

│   ├── revenueRecognition
.ts             // Accounting compliance

│   └── partnerRevenueShare
.ts            // B2B commission splits

├── models
## /

## │   ├── Purchase
.ts                       // Transaction records

## │   ├── Entitlement
.ts                    // Active feature grants

## │   ├── SKU
.ts                            // Product catalog

│   ├── EventRevenueState
.ts              // Per-event monetization

│   └── PartnerContract
.ts                  // B2B licensing terms

├── strategies
## /

│   ├── eventUpgradeStrategy
.ts           // Duration, quality, participants

│   ├── storageStrategy
.ts                // GB tiers, archival

│   ├── exportStrategy
.ts                 // Recap videos, albums

│   └── b2bLicenseStrategy
.ts             // White-label, enterprise

├── middleware
## /

│   ├── entitlementCheck
.ts                 // Route-level feature guards

│   └── usageMetering
.ts                  // Telemetry for billing

└── jobs
## /

├── expirationJob
.ts                  // Graceful downgrade

├── renewalReminders
.ts               // Retention nudges

└── revenueReport
.ts                  // Automated analytics

- Database Schema with Revenue Tables

## -- ============================================


-- CORE TABLES (from original)



## -- ============================================


## CREATE TABLE
users (

id UUID PRIMARY KEY DEFAULT
gen_random_uuid(),
email
## VARCHAR(255) UNIQUE NOT NULL
## ,
phone
## VARCHAR(20) UNIQUE
## ,
password_hash
## VARCHAR(255) NOT NULL
## ,
encryption_salt
## VARCHAR(255) NOT NULL
## ,
avatar_url TEXT,
is_verified
## BOOLEAN DEFAULT FALSE
## ,


-- Revenue: User billing profile


stripe_customer_id
## VARCHAR(255
## ),
default_currency
## VARCHAR(3) DEFAULT 'USD'
## ,
tax_exempt
## BOOLEAN DEFAULT FALSE
## ,
created_at TIMESTAMPTZ
## DEFAULT
## NOW(),
last_login TIMESTAMPTZ
## );

## -- ============================================


## -- REVENUE: EVENT MONETIZATION TABLES


## -- ============================================


## CREATE TABLE
event_revenue_tiers (

id SERIAL PRIMARY KEY
## ,
event_id
VARCHAR(8) REFERENCES events(id) ON DELETE CASCADE
## ,



-- Base tier (always free)


base_duration_hours
## INTEGER DEFAULT 50
## ,
base_storage_gb
## DECIMAL(10,2) DEFAULT 5.00
## ,
base_max_participants
## INTEGER DEFAULT 10
## ,
base_quality
VARCHAR(10) DEFAULT '1080p', -- 1080p, 4k, raw




-- Purchased upgrades (JSONB for flexibility)


purchased_features JSONB
## DEFAULT '[]'
## ,



-- Calculated effective limits


effective_duration_hours
## INTEGER DEFAULT 50
## ,
effective_storage_gb
## DECIMAL(10,2) DEFAULT 5.00
## ,
effective_max_participants
## INTEGER DEFAULT 10
## ,
effective_quality
VARCHAR(10) DEFAULT '1080p'
## ,
effective_archive_days
INTEGER DEFAULT 30, -- Cold storage retention




-- Revenue tracking


total_revenue
## DECIMAL(10,2) DEFAULT 0.00
## ,
currency
## VARCHAR(3) DEFAULT 'USD'
## ,


created_at TIMESTAMPTZ
## DEFAULT
## NOW(),
updated_at TIMESTAMPTZ
## DEFAULT
## NOW()
## );

## CREATE TABLE
purchases (

id UUID PRIMARY KEY DEFAULT
gen_random_uuid(),



## -- Who


user_id UUID
REFERENCES users(id
## ),
event_id
VARCHAR(8) REFERENCES events(id) ON DELETE SET NULL
## ,






## -- What


purchase_type
VARCHAR(50) CHECK (purchase_type IN
## (

## 'event_extension',
-- 50h → 7d, 30d, permanent


## 'quality_upgrade',
-- 1080p → 4k → raw


'storage_boost',        -- +10GB, +50GB, +100GB


'participant_boost',    -- +10, +50, unlimited


'live_recording',       -- Download live stream


'archive_zip',          -- Full event export


'recap_video',          -- AI-assisted offline edit


'lossless_storage',     -- No compression


'forever_storage',      -- Beyond 30-day cold storage


'b2b_license'           -- White-label event

## )),



-- SKU reference


sku_id
## VARCHAR(100) NOT NULL
## ,
sku_snapshot JSONB
NOT NULL, -- Price/description at time of purchase




## -- Pricing


amount
## DECIMAL(10,2) NOT NULL
## ,
currency
## VARCHAR(3) NOT NULL
## ,
discount_applied
## DECIMAL(10,2) DEFAULT 0.00
## ,
tax_amount
## DECIMAL(10,2) DEFAULT 0.00
## ,



## -- Payment


payment_provider
VARCHAR(20) DEFAULT 'stripe'
## ,
payment_intent_id
## VARCHAR(255
## ),
payment_status
VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded




-- Entitlement granted


entitlement_granted_at TIMESTAMPTZ,
entitlement_expires_at TIMESTAMPTZ,
-- NULL = permanent




## -- Metadata


ip_address INET,
user_agent TEXT,
country_code
## VARCHAR(2
## ),

created_at TIMESTAMPTZ
## DEFAULT
## NOW(),
updated_at TIMESTAMPTZ
## DEFAULT
## NOW()
## );




-- SKU Catalog (managed via admin)


## CREATE TABLE
skus (

id VARCHAR(100) PRIMARY KEY
## ,
name
## VARCHAR(255) NOT NULL
## ,
description TEXT,

category VARCHAR(50) CHECK (category IN
## (

## 'event_extension'
## ,

## 'quality_upgrade'
## ,

## 'storage_boost'
## ,

## 'participant_boost'
## ,

## 'export'
## ,

## 'b2b_license'

## )),



## -- Pricing (regional)


base_price_usd
## DECIMAL(10,2) NOT NULL
## ,
regional_pricing JSONB
## DEFAULT '{}', -- {"IN": 99, "EU": 8.99}




-- Features granted


feature_config JSONB
NOT NULL, -- {"duration_hours": 168, "quality": "4k"}




## -- Availability


is_active
## BOOLEAN DEFAULT TRUE
## ,
available_from TIMESTAMPTZ,
available_until TIMESTAMPTZ,



-- B2B only



b2b_only BOOLEAN DEFAULT FALSE
## ,
min_quantity
## INTEGER DEFAULT 1
## ,

created_at TIMESTAMPTZ
## DEFAULT
## NOW()
## );

## -- Examples:


-- INSERT INTO skus (id, name, category, base_price_usd, feature_config) VALUES


-- ('event_ext_7d', '7-Day Event', 'event_extension', 4.99, '{"duration_hours": 168}'),


-- ('event_ext_30d', '30-Day Event', 'event_extension', 9.99, '{"duration_hours": 720}'),


-- ('storage_10gb', '+10GB Storage', 'storage_boost', 2.99, '{"storage_gb": 10}'),


-- ('quality_4k', '4K Quality', 'quality_upgrade', 3.99, '{"quality": "4k"}'),


-- ('participants_50', '50 Participants', 'participant_boost', 7.99, '{"max_participants": 50}'),


-- ('live_recording', 'Live Recording Download', 'export', 5.99, '{"live_download": true}'),


-- ('archive_zip', 'Full Event Archive', 'export', 8.99, '{"archive_zip": true}'),


-- ('recap_video', 'AI Recap Video', 'export', 12.99, '{"recap_video": true}'),


-- ('forever_storage', 'Keep Forever', 'storage_boost', 19.99, '{"archive_days": 36500}');


## -- ============================================

## -- REVENUE: ENTITLEMENT & ACCESS CONTROL

## -- ============================================


## CREATE TABLE
entitlements (

id UUID PRIMARY KEY DEFAULT
gen_random_uuid(),
purchase_id UUID
REFERENCES purchases(id
## ),
user_id UUID
REFERENCES users(id
## ),
event_id
VARCHAR(8) REFERENCES events(id) ON DELETE CASCADE
## ,



-- What they bought


feature_type
## VARCHAR(50
## ),
feature_config JSONB,
-- Applied configuration




## -- Validity


granted_at TIMESTAMPTZ
## DEFAULT
## NOW(),
expires_at TIMESTAMPTZ,
-- NULL = permanent

revoked_at TIMESTAMPTZ,
revoke_reason
## VARCHAR(255
## ),



-- Usage tracking


usage_count
## INTEGER DEFAULT 0
## ,
usage_limit
INTEGER, -- NULL = unlimited



created_at TIMESTAMPTZ
## DEFAULT
## NOW()
## );

## -- ============================================


## -- REVENUE: B2B / WHITE-LABEL TABLES


## -- ============================================


## CREATE TABLE
organizations (

id UUID PRIMARY KEY DEFAULT
gen_random_uuid(),
name
## VARCHAR(255) NOT NULL
## ,
slug
## VARCHAR(100) UNIQUE NOT NULL
## ,






## -- Branding


logo_url TEXT,
primary_color
## VARCHAR(7
## ),
custom_domain
## VARCHAR(255
## ),



## -- Billing


billing_email
## VARCHAR(255
## ),
stripe_customer_id
## VARCHAR(255
## ),
contract_type
VARCHAR(20) CHECK (contract_type IN ('payg', 'bulk', 'enterprise'
## )),



## -- Features


features_enabled JSONB
## DEFAULT '[]'
## ,
api_access
## BOOLEAN DEFAULT FALSE
## ,



## -- Revenue


revenue_share_percent
DECIMAL(5,2) DEFAULT 0.00, -- Their cut

total_events_created
## INTEGER DEFAULT 0
## ,
total_revenue_generated
## DECIMAL(12,2) DEFAULT 0.00
## ,

created_at TIMESTAMPTZ
## DEFAULT
## NOW(),
updated_at TIMESTAMPTZ
## DEFAULT
## NOW()
## );

## CREATE TABLE
organization_members (

id UUID PRIMARY KEY DEFAULT
gen_random_uuid(),
organization_id UUID
REFERENCES organizations(id) ON DELETE CASCADE
## ,
user_id UUID
REFERENCES users(id
## ),

role VARCHAR(20) CHECK (role IN ('admin', 'manager', 'creator'
## )),
created_at TIMESTAMPTZ
## DEFAULT
## NOW()

## );

## CREATE TABLE
organization_events (

id UUID PRIMARY KEY DEFAULT
gen_random_uuid(),
organization_id UUID
REFERENCES organizations(id
## ),
event_id
VARCHAR(8) REFERENCES events(id
## ),



-- White-label config


branding_applied JSONB,
-- Logo, colors, domain used




-- Revenue attribution


gross_revenue
## DECIMAL(10,2) DEFAULT 0.00
## ,
platform_fee
## DECIMAL(10,2) DEFAULT 0.00
## ,
org_revenue
## DECIMAL(10,2) DEFAULT 0.00
## ,

created_at TIMESTAMPTZ
## DEFAULT
## NOW()
## );

## -- ============================================


## -- REVENUE: EXPORT & MARKETPLACE TABLES


## -- ============================================


## CREATE TABLE
export_jobs (

id UUID PRIMARY KEY DEFAULT
gen_random_uuid(),
event_id
VARCHAR(8) REFERENCES events(id
## ),
requested_by UUID
REFERENCES users(id
## ),



-- Export type


export_type
VARCHAR(50) CHECK (export_type IN
## (

## 'archive_zip'
## ,

## 'recap_video'
## ,

## 'photo_album'
## ,

## 'raw_bundle'

## )),



## -- Status


status
VARCHAR(20) DEFAULT 'queued', -- queued, processing, completed, failed

progress_percent
## INTEGER DEFAULT 0
## ,



## -- Delivery


storage_key
VARCHAR(255), -- S3 location

download_url TEXT,
-- Signed URL

expires_at TIMESTAMPTZ,
-- URL expiration




## -- Revenue



purchase_id UUID
REFERENCES purchases(id
## ),

created_at TIMESTAMPTZ
## DEFAULT
## NOW(),
completed_at TIMESTAMPTZ
## );

## CREATE TABLE
marketplace_vendors (

id UUID PRIMARY KEY DEFAULT
gen_random_uuid(),
name
## VARCHAR(255) NOT NULL
## ,
service_type
VARCHAR(50) CHECK (service_type IN
## (

## 'photobook_printing'
## ,

## 'video_editing'
## ,

## 'memory_keepsakes'
## ,

## 'drone_rental'
## ,

## 'equipment_rental'

## )),





## -- Integration


api_endpoint TEXT,
webhook_secret TEXT,



## -- Economics


commission_percent
## DECIMAL(5,2) DEFAULT 15.00
## ,
is_active
## BOOLEAN DEFAULT TRUE
## ,

created_at TIMESTAMPTZ
## DEFAULT
## NOW()
## );

## CREATE TABLE
marketplace_orders (

id UUID PRIMARY KEY DEFAULT
gen_random_uuid(),
event_id
VARCHAR(8) REFERENCES events(id
## ),
user_id UUID
REFERENCES users(id
## ),
vendor_id UUID
REFERENCES marketplace_vendors(id
## ),



-- Order details (opaque to us)


order_payload_encrypted TEXT,
-- Vendor-specific, encrypted




## -- Revenue


order_total
## DECIMAL(10,2
## ),
platform_fee
## DECIMAL(10,2
## ),
vendor_payout
## DECIMAL(10,2
## ),

status
VARCHAR(20) DEFAULT 'pending'
## ,
created_at TIMESTAMPTZ
## DEFAULT
## NOW()
## );


## -- ============================================


## -- REVENUE: ANALYTICS & REPORTING


## -- ============================================


## CREATE TABLE
revenue_daily_snapshots (

id UUID PRIMARY KEY DEFAULT
gen_random_uuid(),
snapshot_date
## DATE UNIQUE NOT NULL
## ,



## -- Breakdown


total_revenue
## DECIMAL(12,2) DEFAULT 0.00
## ,
event_upgrades
## DECIMAL(12,2) DEFAULT 0.00
## ,
storage_fees
## DECIMAL(12,2) DEFAULT 0.00
## ,
export_fees
## DECIMAL(12,2) DEFAULT 0.00
## ,
b2b_licenses
## DECIMAL(12,2) DEFAULT 0.00
## ,
marketplace_fees
## DECIMAL(12,2) DEFAULT 0.00
## ,




## -- Metrics


total_events_created
## INTEGER DEFAULT 0
## ,
paid_events
## INTEGER DEFAULT 0
## ,
conversion_rate
## DECIMAL(5,4) DEFAULT 0.0000
## ,
arpu
DECIMAL(10,2) DEFAULT 0.00, -- Average revenue per user


created_at TIMESTAMPTZ
## DEFAULT
## NOW()
## );

-- Indexes for performance


CREATE INDEX idx_purchases_user ON purchases(user_id, created_at DESC
## );
CREATE INDEX idx_purchases_event ON
purchases(event_id, payment_status);
CREATE INDEX idx_entitlements_event ON
entitlements(event_id, feature_type);
CREATE INDEX idx_entitlements_active ON entitlements(event_id) WHERE revoked_at IS NULL
## ;
CREATE INDEX idx_event_revenue_tiers_event ON
event_revenue_tiers(event_id);
## 4. Revenue Engine: Core Logic

// /services/revenue/src/services/entitlementService.ts


import { Redis } from 'ioredis';

import { EventRevenueTier, Entitlement, Purchase } from '../models';


export class
EntitlementService {

private redis: Redis;



## /**


- Check if an event has access to a specific feature


- Used by API Gateway middleware to gate routes



## */



async checkEntitlement
## (
eventId
: string,

feature
: string,

userId
?: string // For user-specific entitlements

## )
: Promise<EntitlementCheck>
## {

// 1. Check Redis cache (sub-millisecond)


const cacheKey = `ent:${eventId}:${feature}`;


const cached = await this.redis.get(cacheKey);


if (cached) return JSON.parse(cached);



// 2. Fetch event's effective tier from DB


const tier = await EventRevenueTier.findOne({ where: { event_id: eventId } });



// 3. Check active entitlements


const entitlements = await Entitlement.findAll
## ({
where
## :
## {
event_id
: eventId,

revoked_at
: null,


## -

- new Date
## () } }
## ]
## }
## })
## ;



// 4. Calculate effective limits


const effective = this.calculateEffectiveLimits(tier, entitlements);



// 5. Check specific feature


const hasAccess = this.evaluateFeatureAccess(effective, feature, userId);



// 6. Cache result (TTL based on nearest expiration)


const result: EntitlementCheck =
## {
granted
: hasAccess,

effectiveLimits
: effective,

expiresAt
: this.getNearestExpiration(entitlements),

purchaseUrl
: !hasAccess ? this.generatePurchaseUrl(eventId, feature) : null

## }
## ;



await this.redis.setex(cacheKey, 300, JSON.stringify(result));


return result;

## }


## /**


- Apply a purchase to an event


- Called by webhook handler after Stripe confirmation


## */



async applyPurchase(purchase: Purchase): Promise<void>
## {

const sku = await this.getSKU(purchase.sku_id);


const eventTier = await EventRevenueTier.findOne
## ({
where
: { event_id: purchase.event_id
## }

## });



// Start transaction


await sequelize.transaction(async (t) =>
## {

// 1. Create entitlement record


const entitlement = await Entitlement.create
## ({
purchase_id
: purchase.id,

user_id
: purchase.user_id,

event_id
: purchase.event_id,

feature_type
: purchase.purchase_type,

feature_config
: sku.feature_config,

granted_at
: new Date(),

expires_at
: this.calculateExpiry(sku),

usage_limit
: sku.feature_config.usage_limit || null

## }
, { transaction: t });



// 2. Update event tier with new effective limits


const newLimits = this.mergeLimits(eventTier, sku.feature_config);


await eventTier.update
## ({
purchased_features
## :
## [

...eventTier.purchased_features,

{ sku_id
: sku.id, applied_at: new Date
## () }
## ]
## ,

effective_duration_hours
: newLimits.duration_hours,

effective_storage_gb
: newLimits.storage_gb,

effective_max_participants
: newLimits.max_participants,

effective_quality
: newLimits.quality,

effective_archive_days
: newLimits.archive_days,

total_revenue
: sequelize.literal(`total_revenue + ${purchase.amount}`
## )
## }
, { transaction: t });



// 3. Mark purchase as entitled


await purchase.update
## ({
entitlement_granted_at
: new Date(),

payment_status
## : 'completed'

## }
, { transaction: t });



// 4. Emit revenue event for analytics


await this.emitRevenueEvent
## ({
type
## : 'purchase_applied',

purchase_id
: purchase.id,

event_id
: purchase.event_id,

amount
: purchase.amount,

sku_category
: sku.category

## })
## ;

## })
## ;



// 5. Invalidate cache


await this.invalidateCache(purchase.event_id);

## }


## /**


- Graceful downgrade when entitlements expire


- Called by cron job


## */




async handleExpiration(eventId: string): Promise<void>
## {

const tier = await EventRevenueTier.findOne({ where: { event_id: eventId } });



// Revert to base tier


await tier.update
## ({
effective_duration_hours
: tier.base_duration_hours,

effective_storage_gb
: tier.base_storage_gb,

effective_max_participants
: tier.base_max_participants,

effective_quality
: tier.base_quality,

effective_archive_days
: 30 // Back to cold storage

## })
## ;



// If event is past original 50h + any extensions, trigger archive


const event = await Event.findByPk(eventId);


const maxAge = tier.effective_duration_hours * 60 * 60 * 1000;


if (Date.now() - event.created_at.getTime() >
maxAge) {

await this.triggerEventArchive(eventId);

## }
## }




private calculateEffectiveLimits
## (
tier
: EventRevenueTier,

entitlements
## :
## Entitlement[]
## )
## :
EffectiveLimits {

// Start with base


const limits =
## {
duration_hours
: tier.base_duration_hours,

storage_gb
: tier.base_storage_gb,

max_participants
: tier.base_max_participants,

quality
: tier.base_quality,

archive_days
## : 30,

live_recording
: false,

export_formats
## : ['basic_zip'
## ]
## }
## ;



// Apply purchased upgrades (max wins for numerical, highest wins for quality)

entitlements
.forEach(ent =>
## {

const cfg = ent.feature_config;


if (cfg.duration_hours) limits.duration_hours = Math.max(limits.duration_hours,
cfg
## .duration_hours);


if (cfg.storage_gb) limits.storage_gb += cfg.storage_gb; // Cumulative


if (cfg.max_participants) limits.max_participants = Math.max(limits.max_participants,
cfg
## .max_participants);


if (cfg.quality) limits.quality = this.higherQuality(limits.quality, cfg.quality);


if (cfg.archive_days) limits.archive_days = Math.max(limits.archive_days,
cfg
## .archive_days);


if (cfg.live_recording) limits.live_recording = true;


if (cfg.export_formats) limits.export_formats.push(...cfg.export_formats);

## })
## ;



return limits;

## }
## }

- Event Service with Revenue Integration

// /services/event/src/controllers/eventController.ts


import { EntitlementService } from '@revenue/service';

import { StorageService } from '@media/service';


export class
EventController {

private entitlementService: EntitlementService;


private storageService: StorageService;



## /**


- Create event - FREE tier applied automatically


## */



async createEvent(req: Request, res:
## Response) {

const { name, type, location, initial_participants = [] } = req.body;


const userId = req.user.id;




// Create event with 50h expiration


const event = await Event.create
## ({
id
: nanoid(8),

name
## ,


type,

location
## ,

owner_id
: userId,

expires_at
: new Date(Date.now() + 50 * 60 * 60 * 1000),

status
## : 'active'

## })
## ;



// Initialize revenue tier (FREE)


await EventRevenueTier.create
## ({
event_id
: event.id,

base_duration_hours
## : 50,

base_storage_gb
## : 5.00,

base_max_participants
## : 10,

base_quality
## : '1080p',

effective_duration_hours
## : 50,

effective_storage_gb
## : 5.00,

effective_max_participants
## : 10,

effective_quality
## : '1080p',

effective_archive_days
## : 30

## })
## ;



// Add owner as member


await EventMember.create
## ({
event_id
: event.id,

user_id
: userId,

role
## : 'owner'

## })
## ;



return res.json
## ({

event,

tier
## : 'free',


limits:
## {
duration
: '50 hours',

storage
## : '5 GB',

participants
## : 10,

quality
## : '1080p'

## }
## ,

upgrade_options
: this.getUpgradeOptions(event.id
## )
## })
## ;

## }


## /**


- Get event with current entitlements


## */



async getEvent(req: Request, res:
## Response) {

const { eventId } = req.params;


const userId = req.user.id;



const event = await Event.findByPk(eventId,
## {
include
: [EventMember,
EventRevenueTier]
## })
## ;



// Check if user has view access


const membership = await this.checkMembership(eventId, userId);



// Get effective limits


const entitlement = await this.entitlementService.checkEntitlement
## (
eventId
## ,


## 'view'

## )
## ;



return res.json
## ({

event,

membership
## ,

limits
: entitlement.effectiveLimits,

can_upgrade
: membership.role === 'owner' || membership.role === 'co_owner',

upgrade_url
: `/events/${eventId}/upgrade`

## })
## ;

## }


## /**


- Upload media - CHECK STORAGE ENTITLEMENT


## */



async uploadMedia(req: Request, res:
## Response) {

const { eventId } = req.params;



// 1. Check storage entitlement


const storageCheck = await this.entitlementService.checkEntitlement
## (
eventId
## ,


## 'storage_upload'

## )
## ;



if (!storageCheck.granted
## ) {

return res.status(402).json
## ({
error
: 'Storage limit reached',

current_usage
: await this.storageService.getUsage(eventId),

limit
: storageCheck.effectiveLimits.storage_gb,

upgrade_options
: storageCheck.purchaseUrl

## })
## ;

## }


// 2. Check quality entitlement


const quality = req.body.quality || '1080p';


const qualityCheck = await this.entitlementService.checkEntitlement
## (
eventId
## ,


## `quality_${quality}`

## )
## ;



if (!qualityCheck.granted
## ) {

return res.status(402).json
## ({
error
: 'Quality upgrade required',

requested
: quality,

allowed
: qualityCheck.effectiveLimits.quality,

upgrade_url
: qualityCheck.purchaseUrl

## })
## ;

## }


// 3. Process upload


const media = await this.storageService.upload
## ({

## ...req.body,

event_id
: eventId,

quality
: qualityCheck.effectiveLimits.quality,

encrypted
: true

## })
## ;



// 4. Update usage meter


await this.storageService.incrementUsage(eventId, media.size_bytes);



return res.json({ media, remaining_storage: storageCheck.effectiveLimits.storage_gb });

## }


## /**


- Add member - CHECK PARTICIPANT ENTITLEMENT


## */



async addMember(req: Request, res:
## Response) {

const { eventId } = req.params;


const { user_id, role } = req.body;



// Check current participant count


const currentCount = await EventMember.count({ where: { event_id: eventId } });


const entitlement = await this.entitlementService.checkEntitlement
## (
eventId
## ,


## 'add_participant'

## )
## ;



if (currentCount >= entitlement.effectiveLimits.max_participants
## ) {

return res.status(402).json
## ({
error
: 'Participant limit reached',


current: currentCount,

limit
: entitlement.effectiveLimits.max_participants,

upgrade_options
: entitlement.purchaseUrl

## })
## ;

## }


await EventMember.create({ event_id: eventId, user_id, role });


return res.json({ success: true, participants: currentCount + 1 });

## }


## /**


- Start live stream - CHECK LIVE ENTITLEMENT


## */



async startLive(req: Request, res:
## Response) {

const { eventId } = req.params;






// Only owner can go live


const membership = await EventMember.findOne
## ({
where
: { event_id: eventId, user_id: req.user.id, role: 'owner'
## }
## })
## ;



if (!
membership) {

return res.status(403).json({ error: 'Only event owner can start live stream' });

## }


// Check if live recording is enabled (paid feature)


const recordingEntitlement = await this.entitlementService.checkEntitlement
## (
eventId
## ,


## 'live_recording'

## )
## ;



return res.json
## ({
stream_url
: await this.liveService.createStream(eventId),

recording_enabled
: recordingEntitlement.granted,

recording_download_url
: recordingEntitlement.granted ?


`/events/${eventId}/live/recording` : null

## })
## ;

## }


## /**


- Export event - PAID FEATURE


## */



async exportEvent(req: Request, res:
## Response) {

const { eventId } = req.params;


const { type } = req.body; // 'archive_zip', 'recap_video', 'photo_album'



const entitlement = await this.entitlementService.checkEntitlement
## (
eventId
## ,


## `export_${type}`

## )
## ;



if (!entitlement.granted
## ) {

// Create purchase intent


const purchase = await this.createPurchaseIntent(eventId, `export_${type}`);



return res.status(402).json
## ({
error
: 'Export requires purchase',

purchase_url
## : `/checkout/${purchase.id}`,

amount
: purchase.amount,

description
: purchase.description

## })
## ;

## }


// Queue export job


const job = await ExportJob.create
## ({
event_id
: eventId,

requested_by
: req.user.id,

export_type
: type,

purchase_id
: entitlement.purchaseId,

status
## : 'queued'

## })
## ;



return res.json
## ({
job_id
: job.id,

status
## : 'queued',

estimated_completion
: '15 minutes',

download_url
: null // Will be populated when done

## })
## ;

## }


## /**


- Get upgrade options for event


## */



private getUpgradeOptions(eventId: string
## ) {

return
## {
duration
## :
## [
{ sku
: 'event_ext_7d', name: '7-Day Event', price: '$4.99', hours: 168 },

{ sku
: 'event_ext_30d', name: '30-Day Event', price: '$9.99', hours: 720
## }
## ]
## ,

storage
## :
## [
{ sku
: 'storage_10gb', name: '+10GB Storage', price: '$2.99', gb: 10 },

{ sku
: 'storage_50gb', name: '+50GB Storage', price: '$9.99', gb: 50
## }
## ]
## ,

quality
## :
## [
{ sku
: 'quality_4k', name: '4K Quality', price: '$3.99', quality: '4k'
## }
## ]
## ,

participants
## :
## [
{ sku
: 'participants_50', name: '50 Participants', price: '$7.99', count: 50
## }
## ]
## ,

exports
## :
## [
{ sku
: 'live_recording', name: 'Live Recording', price: '$5.99' },

{ sku
: 'archive_zip', name: 'Full Archive', price: '$8.99' },


{ sku: 'recap_video', name: 'AI Recap Video', price: '$12.99'
## }
## ]
## }
## ;

## }
## }
- Payment Service (Stripe Integration)

// /services/payment/src/services/stripeService.ts


import Stripe from 'stripe';


export class
StripeService {

private stripe: Stripe;



## /**


- Create checkout session for event upgrade


## */



async createCheckoutSession(params: CheckoutParams): Promise<Session>
## {

const { userId, eventId, skuId, successUrl, cancelUrl } = params;



const user = await User.findByPk(userId);


const sku = await SKU.findByPk(skuId);


const event = await Event.findByPk(eventId);



// Create customer if not exists


let customerId = user.stripe_customer_id;


if (!
customerId) {

const customer = await this.stripe.customers.create
## ({
email
: user.email,

metadata
: { user_id:
userId }
## })
## ;

customerId
= customer.id;


await user.update({ stripe_customer_id: customerId });

## }


// Create purchase record (pending)


const purchase = await Purchase.create
## ({
user_id
: userId,

event_id
: eventId,

sku_id
: skuId,

sku_snapshot
: sku.toJSON(),

amount
: this.getRegionalPrice(sku, user.country_code),

currency
: user.default_currency,

payment_status
## : 'pending'

## })
## ;



// Create Stripe checkout session


const session = await this.stripe.checkout.sessions.create
## ({
customer
: customerId,

payment_method_types
## : ['card'],

line_items
## :
## [{
price_data
## :
## {
currency
: purchase.currency.toLowerCase(),

product_data
## :
## {

name: `${sku.name} - ${event.name}`,

description
: sku.description,

metadata
## :
## {
event_id
: eventId,

sku_id
## :
skuId
## }
## }
## ,

unit_amount
: Math.round(purchase.amount * 100) // cents

## }
## ,

quantity
## : 1

## }]
## ,

mode
## : 'payment',

success_url
: `${successUrl}?purchase_id=${purchase.id}`,

cancel_url
: cancelUrl,

metadata
## :
## {
purchase_id
: purchase.id,

event_id
: eventId,

sku_id
## :
skuId
## }
## })
## ;



await purchase.update({ payment_intent_id: session.id });



return
## {
session_id
: session.id,

url
: session.url,

purchase_id
: purchase.id

## }
## ;

## }


## /**


- Handle Stripe webhook


## */



async handleWebhook(payload: any, signature: string): Promise<void>
## {

const event = this.stripe.webhooks.constructEvent
## (
payload
## ,

signature
## ,


process.env.STRIPE_WEBHOOK_SECRET

## )
## ;



switch (event.type
## ) {

case 'checkout.session.completed':
## {

const session = event.data.object;


const purchase = await Purchase.findOne
## ({
where
: { payment_intent_id: session.id
## }
## })
## ;



if
## (purchase) {

// Call revenue service to apply entitlement


await this.revenueService.applyPurchase(purchase);



// Emit event for analytics


await this.analyticsService.track('purchase_completed',
## {
purchase_id
: purchase.id,

amount
: purchase.amount,

sku_category
: purchase.sku_snapshot.category


## });

## }

break;

## }


case 'charge.refunded':
## {

// Handle refunds - revoke entitlements gracefully


const charge = event.data.object;


await this.handleRefund(charge);


break;

## }
## }
## }
## }
- B2B / White-Label Service

// /services/b2b/src/services/whiteLabelService.ts


export class
WhiteLabelService {

## /**


- Create white-labeled event for organization


## */



async createOrganizationEvent
## (
orgId
: string,

params
: CreateEventParams,

creatorId
: string

## )
: Promise<Event>
## {

const org = await Organization.findByPk(orgId);



// Check contract limits


const contract = await this.checkContractLimits(orgId);



// Create event with org branding


const event = await Event.create
## ({
id
: nanoid(8),


## ...params,

owner_id
: creatorId,

organization_id
: orgId,

is_white_labeled
: true

## })
## ;



// Initialize with org's default tier (usually higher)


await EventRevenueTier.create
## ({
event_id
: event.id,

base_duration_hours
: contract.included_duration_hours,

base_storage_gb
: contract.included_storage_gb,

base_max_participants
: contract.included_participants,

base_quality
: contract.included_quality,

effective_duration_hours
: contract.included_duration_hours,

effective_storage_gb
: contract.included_storage_gb,

effective_max_participants
: contract.included_participants,

effective_quality
: contract.included_quality

## })
## ;



// Track for revenue attribution


await OrganizationEvent.create
## ({
organization_id
: orgId,

event_id
: event.id,

branding_applied
## :
## {
logo
: org.logo_url,

color
: org.primary_color,

domain
: org.custom_domain

## }
## })
## ;



return event;

## }


## /**


- Calculate monthly invoice for organization


## */



async generateInvoice(orgId: string, month: Date): Promise<Invoice>
## {

const org = await Organization.findByPk(orgId);


const contract = await this.getContract(orgId);



const events = await OrganizationEvent.findAll
## ({
where
## :
## {
organization_id
: orgId,

created_at
## :
## {

- startOfMonth(month),


- endOfMonth
## (month)
## }
## }
## })
## ;



let total = 0;


const lineItems = [];



if (contract.type === 'payg'
## ) {

// Pay per event

events
.forEach(event =>
## {

const baseFee = 5.00;


const overages = this.calculateOverages(event);


const subtotal = baseFee + overages;


lineItems
## .push
## ({
description
: `Event ${event.event_id}`,

quantity
## : 1,

unit_price
## :
subtotal
## })
## ;


total
+= subtotal;

## })
## ;

## }
else if (contract.type === 'bulk'
## ) {

// Pre-purchased credits


const usedCredits = events.length;


const remainingCredits = contract.credits - usedCredits;

total
= 0; // Already paid



lineItems
## .push
## ({
description
: `Bulk credits used: ${usedCredits}`,

quantity
: usedCredits,

unit_price
## : 0

## })
## ;

## }
else if (contract.type === 'enterprise'
## ) {

// Annual flat fee + overages

total
= contract.monthly_overages || 0;

## }


// Calculate revenue share


const platformFee = total * 0.30; // 30% platform


const orgRevenue = total * 0.70;   // 70% to org



return
## {
organization_id
: orgId,

month
## ,

line_items
: lineItems,

subtotal
: total,

platform_fee
: platformFee,

org_revenue
: orgRevenue,

status
## : 'generated'

## }
## ;

## }
## }
- Export Service (Paid Features)

## // /services/export/src/

├── handlers
## /

│   ├── archive
.go              // Full event ZIP export

│   ├── recap
.go                // AI-assisted video recap

│   └── album
.go                // Photo album generation

├── processors
## /

│   ├── ffmpeg
.go               // Video transcoding

│   ├── aiRecap
.go              // Offline AI (privacy-safe)

│   └── layout
.go               // Album layout algorithms

└── storage
## /

└── tempStorage
.go          // Temporary export storage


## // /services/export/src/processors/recap.go


package
processors

import (


## "os/exec"


## "path/filepath"

## )


type RecapProcessor struct {


// No cloud AI - all processing local or on-device

ffmpegPath
string

tempDir
string

## }


func (rp *RecapProcessor) GenerateRecap(eventID string, mediaList []Media) (string, error) {


// 1. Validate purchase entitlement (via API call to revenue service)


if !rp.validateEntitlement(eventID, "recap_video") {


return "",
ErrNoEntitlement

## }



// 2. Download media (decrypted)

clips
## := []string{}


for _, media := range mediaList {


if media.Type == "video" || media.Type == "photo" {

path
, err := rp.downloadAndDecrypt(media)


if err != nil {


continue // Skip failed downloads


## }

clips
= append(clips, path)


## }


## }



// 3. AI-assisted selection (ON-DEVICE ONLY, no server AI)


// This uses lightweight local models for:


// - Face detection (find people)


// - Motion analysis (find action)


// - Quality scoring (blur detection)

selectedClips
:= rp.selectBestMoments(clips, 60) // 60 seconds max



// 4. Stitch together with music

outputPath
:= filepath.Join(rp.tempDir, eventID+"_recap.mp4")


cmd
:= exec.Command(rp.ffmpegPath,


"-f", "concat", "-safe", "0", "-i", rp.createInputList(selectedClips),


## "-vf", "fade=st=0:d=0.5,fade=type=out:start_time=59:d=0.5",


## "-c:v", "libx264", "-preset", "slow", "-crf", "18",


## "-pix_fmt", "yuv420p",

outputPath
## ,


## )



if err := cmd.Run(); err != nil {


return "",
err

## }



// 5. Upload to S3 with expiration (7 days to download)

s3Key
:= "exports/" + eventID + "/recap.mp4"


if err := rp.uploadToS3(outputPath, s3Key, 7*24*time.Hour); err != nil {


return "",
err

## }



// 6. Generate signed URL

downloadURL
:= rp.generateSignedURL(s3Key, 7*24*time.Hour)



// 7. Cleanup local files

rp
.cleanup(clips, outputPath)



return downloadURL, nil

## }

- Client-Side: Purchase Flow UI

// /clients/ios/ProjectPic/Features/Event/UpgradeView.swift



struct EventUpgradeView: View {


let eventId:
## String

@StateObject private var viewModel = UpgradeViewModel()



var body: some View {

ScrollView
## {

VStack
## (spacing: 24) {


// Current tier display

CurrentTierCard
## (

duration
: viewModel.currentDuration,

storage
: viewModel.currentStorage,

participants
: viewModel.currentParticipants,

quality
: viewModel.
currentQuality

## )



// Upgrade categories

UpgradeSection
(title: "Extend Event Duration") {

ForEach
(viewModel.durationOptions) { option in

UpgradeCard
## (

title
: option.name,

subtitle
: "Keep event active for \(option.hours) hours",

price
: option.price,

isPopular
: option.isPopular,

action
: { viewModel.purchase(option.sku) }


## )


## }


## }


UpgradeSection
(title: "Increase Storage") {

ForEach
(viewModel.storageOptions) { option in

UpgradeCard
## (

title
: option.name,

subtitle
: "Add \(option.gb) GB to your event",

price
: option.price,

action
: { viewModel.purchase(option.sku) }


## )


## }


## }


UpgradeSection
(title: "Professional Exports") {

ForEach
(viewModel.exportOptions) { option in

UpgradeCard
## (

title
: option.name,

subtitle
: option.description,

price
: option.price,

action
: { viewModel.purchase(option.sku) }


## )


## }


## }


## }


## .padding()


## }


.sheet(isPresented: $viewModel.showingCheckout) {

CheckoutSheet
(purchase: viewModel.activePurchase)


## }


## }

## }


class UpgradeViewModel: ObservableObject {


func purchase(sku: String) {


// Call backend to create purchase intent

APIClient
.shared.createPurchase(eventId: eventId, skuId: sku)


.sink { [weak self] purchase in


self?.activePurchase =
purchase

self?.showingCheckout = true


## }


## .store(in: &cancellables)


## }

## }

- API Gateway: Entitlement Middleware

// /gateway/middleware/entitlementCheck.ts


import { EntitlementServiceClient } from '@revenue/client';


## /**


- Express middleware to check entitlements before route access


## */


export function requireEntitlement(feature: string
## ) {

return async (req: Request, res: Response, next: NextFunction) =>
## {

const eventId = req.params.eventId || req.body.event_id;


const userId = req.user.id;



const client = new EntitlementServiceClient();


const check = await client.checkEntitlement(eventId, feature, userId);



if (!check.granted
## ) {

## // Return 402 Payment Required


return res.status(402).json
## ({
error
: 'Upgrade required',

code
## : 'ENTITLEMENT_REQUIRED',

feature
: feature,

current_limits
: check.effectiveLimits,

upgrade_url
: check.purchaseUrl,


// Human-friendly message

message
: getEntitlementMessage(feature, check.effectiveLimits
## )
## })
## ;

## }


// Attach entitlement info to request for downstream use

req
.entitlement = check;


next();

## }
## ;

## }

// Usage in routes:

// router.post('/:eventId/live',

//   requireAuth,

//   requireEntitlement('live_stream'),

//   liveController.startStream

## // );


- Revenue Analytics (Internal)

// /services/analytics/src/revenueAnalytics.ts


export class
RevenueAnalytics {

## /**


- Daily revenue snapshot for dashboard


## */



async generateDailySnapshot(date: Date): Promise<void>
## {

const start = startOfDay(date);


const end = endOfDay(date);



const purchases = await Purchase.findAll
## ({
where
## :
## {
created_at
## :
## {
- [start, end] },

payment_status
## : 'completed'

## }
## })
## ;



const snapshot =
## {
snapshot_date
: date,

total_revenue
: purchases.reduce((sum, p) => sum + p.amount, 0),

event_upgrades
: this.sumByCategory(purchases, 'event_extension'),

storage_fees
: this.sumByCategory(purchases, 'storage_boost'),

export_fees
: this.sumByCategory(purchases, 'export'),

b2b_licenses
: this.sumByCategory(purchases, 'b2b_license'),


total_events_created
: await Event.count({ where: { created_at:
## {
- [start, end] } } }),

paid_events
: new Set(purchases.map(p => p.event_id)).size,


conversion_rate
: 0, // Calculated below

arpu
## : 0

## }
## ;



// Conversion: events with purchases / total events

snapshot
.conversion_rate = snapshot.paid_events / snapshot.total_events_created;



// ARPU: Total revenue / active users that day


const activeUsers = await this.getActiveUsers(start, end);

snapshot
.arpu = snapshot.total_revenue / activeUsers;



await RevenueDailySnapshot.create(snapshot);

## }


## /**


- B2B partner performance


## */



async generatePartnerReport(orgId: string, start: Date, end: Date): Promise<PartnerReport>
## {

const events = await OrganizationEvent.findAll
## ({

where:
## {
organization_id
: orgId,

created_at
## :
## {
## - [start,
end] }
## }
## })
## ;



return
## {
organization_id
: orgId,

period
: { start, end },

events_created
: events.length,

total_gmv
: events.reduce((sum, e) => sum + e.gross_revenue, 0),

platform_fees
: events.reduce((sum, e) => sum + e.platform_fee, 0),

partner_revenue
: events.reduce((sum, e) => sum + e.org_revenue, 0),

top_events
: events.sort((a, b) => b.gross_revenue - a.gross_revenue).slice(0, 10
## )
## }
## ;

## }
## }
- Infrastructure: Revenue-Specific Resources

## # /infra/k8s/revenue-deployment.yaml


apiVersion: apps/v1

kind: Deployment

metadata:

name: revenue-service

spec:

replicas: 3

template:

spec:

containers:


- name: revenue


image: projectpic/revenue:latest

env:


- name: STRIPE_SECRET_KEY


valueFrom:

secretKeyRef:

name: stripe-credentials

key: secret_key


- name: STRIPE_WEBHOOK_SECRET


valueFrom:

secretKeyRef:

name: stripe-credentials

key: webhook_secret


- name: REDIS_URL


value: redis://redis-cluster:6379


- name: DATABASE_URL



valueFrom:

secretKeyRef:

name: db-credentials

key: url



## # /infra/terraform/revenue_resources.tf


# S3 bucket for export deliveries (auto-expire)


resource "aws_s3_bucket" "exports" {

bucket = "projectpic-exports-${var.environment}"



lifecycle_rule {

id      = "auto-delete-exports"

enabled = true



expiration {

days = 7  # Exports available for 7 days

## }

## }

## }


# ElastiCache for entitlement caching


resource "aws_elasticache_cluster" "entitlements" {

cluster_id           = "entitlements-${var.environment}"

engine              = "redis"

node_type           = "cache.t3.medium"

num_cache_nodes     = 2



# Entitlements cached for 5 minutes

# Critical for performance - every upload checks storage

## }


# SQS for export job queue


resource "aws_sqs_queue" "exports" {

name = "projectpic-exports-${var.environment}"



# Long polling for efficient processing

receive_wait_time_seconds = 20



# Dead letter queue for failed exports

redrive_policy = jsonencode({

deadLetterTargetArn = aws_sqs_queue.exports_dlq.arn

maxReceiveCount     = 3

## })

## }

## 13. Revenue Flow Summary

## ┌─────────────────────────────────────────────────────────────────────────┐
## │                         REVENUE FLOW                                     │
## ├─────────────────────────────────────────────────────────────────────────┤
## │                                                                          │
## │  USER CREATES EVENT ───────────────────────────────► FREE TIER            │
│  (50h, 5GB, 10 people, 1080p)                                            │

## │                                                                          │
## │  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  HITS LIMIT? (storage full, need more time, want 4K, etc.)      │   │
## │  └─────────────────────────────────────────────────────────────────┘   │
## │                          │                                               │
## │                          ▼                                               │
## │  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  SHOW UPGRADE UI (contextual, not annoying)                     │   │
│  │  • "Your event is 90% full"                                     │   │
│  │  • "Event expires in 2 hours - extend?"                         │   │
## │  └─────────────────────────────────────────────────────────────────┘   │
## │                          │                                               │
## │                          ▼                                               │
## │  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  STRIPE CHECKOUT (one-time payment, no subscription)              │   │
## │  │  • Apple Pay / Google Pay / Card                                │   │
## │  └─────────────────────────────────────────────────────────────────┘   │
## │                          │                                               │
## │                          ▼                                               │
## │  ┌─────────────────────────────────────────────────────────────────┐   │
## │  │  WEBHOOK CONFIRMS PAYMENT                                       │   │
│  │  • Grant entitlement immediately                              │   │
│  │  • Update event limits in real-time                           │   │
│  │  • Cache in Redis for fast checks                               │   │
## │  └─────────────────────────────────────────────────────────────────┘   │
## │                          │                                               │
## │                          ▼                                               │
## │  ┌─────────────────────────────────────────────────────────────────┐   │
## │  │  USER CONTINUES WITH UPGRADED FEATURES                          │   │
│  │  • Upload more photos                                           │   │
│  │  • Extend event duration                                        │   │
│  │  • Export 4K video                                              │   │
## │  └─────────────────────────────────────────────────────────────────┘   │
## │                          │                                               │
## │                          ▼                                               │
## │  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  EVENT ENDS (50h or extended)                                   │   │
│  │  • Move to cold storage (30 days free)                          │   │
│  │  • Offer "Keep Forever" purchase ($19.99)                         │   │
## │  └─────────────────────────────────────────────────────────────────┘   │
## │                          │                                               │
## │                          ▼                                               │
## │  ┌─────────────────────────────────────────────────────────────────┐   │
## │  │  NO PURCHASE?                                                   │   │
│  │  • Auto-delete after 30 days                                    │   │
│  │  • User warned at 7 days, 1 day                                 │   │
## │  └─────────────────────────────────────────────────────────────────┘   │
## │                                                                          │
## │  B2B FLOW:                                                               │
│  Organization signs contract ──► Creates white-label events            │
│  ──► Revenue split 70/30 (org/platform) ──► Monthly invoice            │
## │                                                                          │
## └─────────────────────────────────────────────────────────────────────────┘
## 14. Key Revenue Metrics Dashboard

// /services/admin/src/dashboard/RevenueDashboard.tsx


interface
RevenueMetrics {

// Core KPIs

dailyRevenue
: number;

conversionRate
: number; // Events with purchase / Total events

arpu
: number; // Average revenue per user

arppu
: number; // Average revenue per paying user



## // Breakdown

revenueByCategory
## :
## {
eventExtensions
: number;

storage
: number;

exports
: number;

b2b
: number;

## }
## ;



## // Funnel

eventsCreated
: number;

eventsWithPurchase
: number;

repeatPurchases
: number; // Same event, multiple upgrades



## // B2B

activeOrganizations
: number;

b2bRevenue
: number;

topPartners
## : Organization[];

## }
Every limit check, every feature gate, every storage calculation routes through the Entitlement Service:
- No dark patterns - Users always know what they’re paying for
- No subscriptions - Purely situational, event-based purchases
- No privacy compromise - Revenue model doesn’t require data harvesting
- B2B scalability - White-label provides enterprise revenue without consumer friction