import { db } from './src/db/index.js';
import { dailyProgress } from './src/db/schema/progress.js';
import { SURAH_VERSE_COUNTS } from './src/lib/progress/validators.js';
import { eq } from 'drizzle-orm';

// Helper function to parse ayah reference and validate
function validateAndFixAyahReference(ref) {
    if (!ref) return { valid: true, original: ref, fixed: ref };
    
    const pattern = /^\d{1,3}:\d{1,3}$/;
    if (!pattern.test(ref)) {
        return { valid: false, original: ref, error: 'Invalid format' };
    }

    const [surah, ayah] = ref.split(':').map(Number);

    // Validate Surah number (1-114)
    if (surah < 1 || surah > 114) {
        return { valid: false, original: ref, error: `Invalid Surah: ${surah}` };
    }

    // Validate Ayah exists within the official range of the Surah
    const max = SURAH_VERSE_COUNTS[surah];
    if (ayah < 1 || ayah > max) {
        // Fix by capping at max verses
        const fixed = `${surah}:${Math.min(ayah, max)}`;
        return { valid: false, original: ref, fixed, error: `Ayah ${ayah} exceeds max ${max} for Surah ${surah}` };
    }

    return { valid: true, original: ref, fixed: ref };
}

// Helper function to validate and fix hifz ayat mistakes
function validateAndFixHifzAyatMistakes(ayatMistakes) {
    if (!ayatMistakes || !Array.isArray(ayatMistakes)) {
        return { valid: true, original: ayatMistakes, fixed: ayatMistakes };
    }

    const fixed = ayatMistakes.map(item => {
        const validation = validateAndFixAyahReference(item.ayah);
        return {
            ayah: validation.fixed || item.ayah,
            mistakes: item.mistakes
        };
    });

    const hasInvalid = ayatMistakes.some((item, index) => {
        const validation = validateAndFixAyahReference(item.ayah);
        return !validation.valid;
    });

    return { valid: !hasInvalid, original: ayatMistakes, fixed };
}

async function fixVerseValidation() {
    console.log('Starting verse validation fix...');
    
    try {
        // Fetch all progress records
        const records = await db.select().from(dailyProgress);
        console.log(`Found ${records.length} progress records to check`);

        let fixedCount = 0;
        let invalidCount = 0;

        for (const record of records) {
            const updates = {};
            let needsUpdate = false;

            // Check Nazra ayah references
            if (record.nazraFromAyah) {
                const validation = validateAndFixAyahReference(record.nazraFromAyah);
                if (!validation.valid) {
                    console.log(`Invalid nazraFromAyah in record ${record.id}: ${validation.original} -> ${validation.fixed} (${validation.error})`);
                    updates.nazraFromAyah = validation.fixed;
                    needsUpdate = true;
                    invalidCount++;
                }
            }

            if (record.nazraToAyah) {
                const validation = validateAndFixAyahReference(record.nazraToAyah);
                if (!validation.valid) {
                    console.log(`Invalid nazraToAyah in record ${record.id}: ${validation.original} -> ${validation.fixed} (${validation.error})`);
                    updates.nazraToAyah = validation.fixed;
                    needsUpdate = true;
                    invalidCount++;
                }
            }

            // Check Hifz ayat mistakes
            if (record.hifzAyatMistakes) {
                const validation = validateAndFixHifzAyatMistakes(record.hifzAyatMistakes);
                if (!validation.valid) {
                    console.log(`Invalid hifzAyatMistakes in record ${record.id}`);
                    updates.hifzAyatMistakes = validation.fixed;
                    needsUpdate = true;
                    invalidCount++;
                }
            }

            // Update if needed
            if (needsUpdate) {
                await db.update(dailyProgress)
                    .set({ ...updates, updatedAt: new Date() })
                    .where(eq(dailyProgress.id, record.id));
                fixedCount++;
            }
        }

        console.log(`\nValidation complete:`);
        console.log(`- Total records checked: ${records.length}`);
        console.log(`- Invalid records found: ${invalidCount}`);
        console.log(`- Records fixed: ${fixedCount}`);
        
        if (fixedCount > 0) {
            console.log(`\n✅ Successfully fixed ${fixedCount} records`);
        } else {
            console.log(`\n✅ All records are valid`);
        }

    } catch (error) {
        console.error('Error during validation fix:', error);
        process.exit(1);
    }
}

// Run the fix
fixVerseValidation().then(() => {
    console.log('\nDone!');
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
