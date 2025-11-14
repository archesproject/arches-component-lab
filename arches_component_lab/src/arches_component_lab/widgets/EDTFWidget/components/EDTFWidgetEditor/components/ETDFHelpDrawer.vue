<script setup lang="ts">
import { ref } from "vue";
import Drawer from "primevue/drawer";
import { useGettext } from "vue3-gettext";

const { $gettext } = useGettext();
const _ = $gettext;

const visible = ref(false);
</script>

<template>
    <Drawer
        v-model:visible="visible"
        position="right"
        style="height: 100%; width: 30%"
        :modal="true"
        :dismissable="true"
    >
        <h4>{{ _("Extended Date/Time Formats (EDTF)") }}</h4>
        <p>
            {{
                _(
                    "The EDTF datatype allows you to describe dates (even uncertain dates). You can find a summary of the standard here: EDTF Date Specfication (Library of Congress)",
                )
            }}
        </p>
        <p>{{ _("Some common encodings:") }}</p>
        <p><b>2021-04-12</b> {{ _('[year]["-"][month]["-"][day]') }}</p>
        <p>
            {{
                _(
                    "Refers to the calendar date 2021 April 12th with day precision",
                )
            }}
        </p>
        <p><b>2021-04</b>{{ _('[year]["-"][month]') }}</p>
        <p>
            {{
                _(
                    "Refers to the calendar month April 2021 with month precision",
                )
            }}
        </p>
        <p><b>2021</b>{{ _("[year]") }}</p>
        <p>{{ _("Refers to the year 2021 with year precision") }}</p>
        <p><b>1964/2008</b></p>
        <p>
            {{
                _(
                    "A time interval with calendar year precision, beginning sometime in 1964 and ending sometime in 2008",
                )
            }}
        </p>
        <p><b>2004-06/2006-08</b></p>
        <p>
            {{
                _(
                    "A time interval with calendar month precision, beginning sometime in June 2004 and ending sometime in August of 2006",
                )
            }}
        </p>
        <p><b>2004-02-01/2005</b></p>
        <p>
            {{
                _(
                    "A time interval with calendar year precision, beginning sometime in 1964 and ending sometime in 2008",
                )
            }}
        </p>
        <p><b>Y-100000</b></p>
        <p>
            {{
                _(
                    'The year -100000. "Y" may be used at the beginning of the date string to signify that the date is a year, when (and only when) the year exceeds four digits, i.e. for years later than 9999 or earlier than -9999.',
                )
            }}
        </p>
        <p><b>2001-21</b></p>
        <p>
            {{
                _(
                    'Spring, 2001. The values 21, 22, 23, 24 may be used used to signify "Spring", "Summer", "Autumn", "Winter", respectively, in place of a month value (01 through 12) for a year-and-month format string',
                )
            }}
        </p>
        <p><b>1984?</b></p>
        <p>
            {{
                _("Year uncertain (possibly the year 1984, but not definitely)")
            }}
        </p>
        <p><b>2004-06~</b></p>
        <p><b>2004-06-11%</b></p>
        <p>{{ _("Entire date (year-month-day) uncertain and approximate") }}</p>
    </Drawer>
</template>

<style scoped>
p {
    margin-bottom: 0.5rem;
}
</style>
