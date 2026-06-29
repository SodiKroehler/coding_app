#!/usr/bin/env python3
"""
Seed codebook examples from the ICWSM24 CT coding guideline PDF.

Usage:
    python scripts/seed_codebook_icwsm24.py

Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env in coding_app/.
All 10 examples from the paper are inserted.
Safe to run multiple times — upsert on tweet id, duplicate codebook rows skipped.
"""

from _env import supabase_client

supabase = supabase_client()

SOURCE = "CT Coding Guideline – ICWSM24"

# ---------------------------------------------------------------------------
# Example tweets (the source posts)
# tweet_id uses a stable prefix so re-running is idempotent
# platform = reddit (all examples are Reddit posts)
# ---------------------------------------------------------------------------
EXAMPLE_TWEETS = [
    {
        "id": "icwsm24_ex_01",
        "platform": "reddit",
        "content": (
            "Electoral College. Votes don't matter. The banks own all 52 electoral voters. "
            "Your actual voting numbers do not matter. Your vote does not matter, the representative of "
            "your state could vote against you. Fraud doesn't matter one bit, the electoral voter already "
            "voted. Unless you have shit on them, it doesn't matter. Welcome back to reality. Make sure "
            "to vote for a rich guy who used slaves to become rich while your vote doesn't even matter lol. "
            "No votes matter."
        ),
    },
    {
        "id": "icwsm24_ex_02",
        "platform": "reddit",
        "content": (
            "Suppose you have it backwards? What if the aim is not to eliminate the vaccinated, with the "
            "vaccine, but to eliminate the unvaccinated, as in all the MAGA types? Maybe it's a way to get "
            "rid of all the followers of Donald J. Trump? Seems like a lot of unvaccinated getting sick right now."
        ),
    },
    {
        "id": "icwsm24_ex_03",
        "platform": "reddit",
        "content": "Space Force. And now we are being separated into our homes... Does anyone think these 2 events may be related...",
        "metadata": {"url": "https://www.reddit.com/r/conspiracy/comments/5wm3/space_force/"},
    },
    {
        "id": "icwsm24_ex_04",
        "platform": "reddit",
        "content": "New Forensics Tool to Detect NASA Fakes https://medium.com/p/434c0a85affa",
        "metadata": {
            "url": "https://www.reddit.com/r/conspiracyundone/comments/utm2rn/new_forensics_tool_to_detect_nasa_fakes/"
        },
    },
    {
        "id": "icwsm24_ex_05",
        "platform": "reddit",
        "content": (
            "Elon Musk Neuralink Snuff device. I am into Snuff show for Elon Musk fun - link to neuralink CT"
        ),
        "metadata": {
            "url": "https://www.reddit.com/r/conspiracy_commons/comments/mwc2uf/elon_musk_neuralink_snuff_device/"
        },
    },
    {
        "id": "icwsm24_ex_06",
        "platform": "reddit",
        "content": (
            "Who's skeptical of the $1200? What are the odds that they will force you to get the vaccine? "
            "Feels like a trap"
        ),
    },
    {
        "id": "icwsm24_ex_07",
        "platform": "reddit",
        "content": (
            "Are there any livestreams from Afghanistan that are not from a news source? "
            "Like people filming right now? Can't find anything on YouTube."
        ),
    },
    {
        "id": "icwsm24_ex_08",
        "platform": "reddit",
        "content": (
            "Oregon has made reading, math, and writing racist which I never thought we could be racist just "
            "for breathing! We should all embrace this and bring peace and global health!"
        ),
    },
    {
        "id": "icwsm24_ex_09",
        "platform": "reddit",
        "content": (
            "Has anyone actually watched mainstream news lately? Ss: Traumatized everyone for a year and then "
            "subject them to this repetitive mind numbing terror frequency. Holy heck. I now see how people "
            "are like fucking zombies."
        ),
    },
    {
        "id": "icwsm24_ex_10",
        "platform": "reddit",
        "content": (
            "The LEFT exists to lure in the youth and radically change our culture/politics. The RIGHT exists "
            "to pacify patriots/old people by pretending to \"oppose\" the left. Truly take a step back and "
            "think about it. What exactly have the conservatives *actually conserved*? I mean really, they've "
            "quite **literally** conserved nothing. Nothing at all. For 60 years. All they do is pacify the "
            "elderly and patriot-types until the leftist media has normalized whatever bullshit they're trying "
            "to push. Then they move on to the next thing and the \"conservatives\" move on as well, pretending "
            "to be outraged again. And so on and so fourth."
        ),
    },
]

# ---------------------------------------------------------------------------
# Codebook examples — one per post
# code = 'conspiracy' (the CT dimension)
# ---------------------------------------------------------------------------
CODEBOOK_EXAMPLES = [
    {
        "tweet_id": "icwsm24_ex_01",
        "code": "conspiracy",
        "justification": (
            "CT. The author elaborates on a scenario where a group of people — bankers and rich individuals — "
            "control the election results and the democratic process, robbing citizens of meaningful votes. "
            "Agent: Bankers/rich. Action: Control electoral votes so individual votes don't matter. "
            "Objective: Control democracy."
        ),
    },
    {
        "tweet_id": "icwsm24_ex_02",
        "code": "conspiracy",
        "justification": (
            "CT. The post explains a conspiracy theory where COVID is created to eliminate Trump supporters "
            "and MAGA members — a group that tends to refuse the vaccine. "
            "Agent: Government. Action: COVID virus as a bio-weapon. "
            "Objective: Eliminate Trump supporters via vaccine."
        ),
    },
    {
        "tweet_id": "icwsm24_ex_03",
        "code": "conspiracy",
        "justification": (
            "CT. The post refers to the known 'Space Force' CT, which followed Trump's request to create a "
            "new military branch (some speculated it would handle alien attacks). The statement "
            "'separated into our homes' and the rhetorical question reflect agreement with the theory. "
            "Illustrates: reference to a known CT + expression of agreement = CT."
        ),
    },
    {
        "tweet_id": "icwsm24_ex_04",
        "code": "conspiracy",
        "justification": (
            "NOT CT. The text may indicate a potential relation to a CT, but the attitude of the author "
            "toward the event (existence of a new forensic tool) is not clear. "
            "Illustrates: ambiguous author stance → label as nonCT. "
            "Note: images and embedded links are NOT used as signals to label CT content."
        ),
    },
    {
        "tweet_id": "icwsm24_ex_05",
        "code": "conspiracy",
        "justification": (
            "NOT CT. The linked content contains CT elements, but the post itself merely shares the link "
            "without commenting on its content. "
            "Illustrates: content sharing without author endorsement → NOT CT. "
            "The labeling criteria does not consider links' content as a signal to indicate CT."
        ),
    },
    {
        "tweet_id": "icwsm24_ex_06",
        "code": "conspiracy",
        "justification": (
            "CT. The post asks about stimulus checks, but the second part elaborates a perspective that "
            "frames a potential hidden agenda or secret intention (forced vaccine), and the last part "
            "('Feels like a trap') signals the author's belief in that agenda. "
            "Illustrates: rhetorical question that encloses CT elements + author agreement → CT."
        ),
    },
    {
        "tweet_id": "icwsm24_ex_07",
        "code": "conspiracy",
        "justification": (
            "NOT CT. The post asks for a source of information about the war in Afghanistan. The topic may "
            "have surrounding CTs, but the post does not promote any CT — it is a simple inquiry for information. "
            "Illustrates: genuine inquiry vs. rhetorical question → NOT CT."
        ),
    },
    {
        "tweet_id": "icwsm24_ex_08",
        "code": "conspiracy",
        "justification": (
            "NOT CT. The post represents an observation with criticism. Despite the controversial nature of "
            "the topic, it does not contain a hidden or malicious agenda. The last part promotes a peaceful "
            "and positive message, reducing the chance of harmful intent. "
            "Illustrates: criticism/frustration ≠ CT unless there is endorsement of a conspiracy belief."
        ),
    },
    {
        "tweet_id": "icwsm24_ex_09",
        "code": "conspiracy",
        "justification": (
            "BORDERLINE — consensus never reached. One interpretation: CT about media control being used as "
            "a tool to turn citizens into 'zombies' for hidden agendas (Agent: mainstream media; "
            "Action: numbing minds; Objective: hidden control). Other interpretation: frustration and "
            "criticism toward mainstream media without a clear agent or hidden agenda. "
            "Illustrates: borderline case — when intention is unclear, default to nonCT or flag for discussion."
        ),
    },
    {
        "tweet_id": "icwsm24_ex_10",
        "code": "conspiracy",
        "justification": (
            "BORDERLINE — consensus never reached. One interpretation: CT arguing the Left/Right political "
            "divide is a designed conspiracy to keep citizens distracted from bigger hidden agendas "
            "(Agent: Left+Right political establishment; Action: pacify and divide; Objective: normalize "
            "harmful policies unnoticed). Other interpretation: political frustration at both parties' "
            "failure to deliver on promises, without promoting a CT. "
            "Illustrates: political frustration vs. structural conspiracy claim — borderline, discuss in consensus meeting."
        ),
    },
]


def main():
    print("Inserting example tweets…")
    for tw in EXAMPLE_TWEETS:
        record = {
            "id": tw["id"],
            "platform": tw["platform"],
            "content": tw["content"],
            "author": tw.get("author"),
            "posted_at": tw.get("posted_at"),
            "metadata": tw.get("metadata"),
        }
        supabase.table("tweets").upsert(record, on_conflict="id", ignore_duplicates=True).execute()
        print(f"  {tw['id']}")

    print("\nInserting codebook examples…")
    for ex in CODEBOOK_EXAMPLES:
        supabase.table("codebook_examples").insert({
            "tweet_id": ex["tweet_id"],
            "code": ex["code"],
            "justification": ex["justification"],
            "added_by": SOURCE,
        }).execute()
        print(f"  {ex['tweet_id']}")

    print(f"\nDone — {len(EXAMPLE_TWEETS)} tweets, {len(CODEBOOK_EXAMPLES)} codebook examples inserted.")


if __name__ == "__main__":
    main()
