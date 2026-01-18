<script setup lang="ts">
import { ref, onMounted } from "vue";

const showFunDisclaimer = ref(false);

onMounted(() => {
    if (typeof window !== "undefined" && location.hostname === "localhost") {
        (window as any).showFunDisclaimer = () => {
            console.log("%c🚨 開啟彩蛋頁啦！", "color: hotpink; font-weight: bold;");
            showFunDisclaimer.value = true;
        };
    }
});
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 bg-texture-dark">
        <div class="max-w-4xl mx-auto space-y-8">
            <header class="text-center pt-8 pb-4">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    關於本工具
                </h1>
            </header>

            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6 sm:p-8" v-if="!showFunDisclaimer">
                <section class="section">
                    <h2 class="text-2xl font-bold text-accent mb-4 pb-2 border-b border-gray-700">數據來源與計算方式</h2>
                    <p class="text-gray-300 leading-relaxed">
                        本工具所使用之技能倍率、裝備加成、傷害公式等資料，皆來自玩家社群多年來的觀察與熱心實測。雖力求接近實際數值，但並非由遊戲原始碼或官方正式文件中取得，仍有誤差或遺漏之可能。
                    </p>
                </section>

                <section class="section">
                    <h2 class="text-2xl font-bold text-accent mb-4 pb-2 border-b border-gray-700">用途說明</h2>
                    <p class="text-gray-300 leading-relaxed">
                        本工具僅供個人參考、娛樂、與模擬使用。不構成任何實際遊戲操作、投資決策、或裝備購買之建議，請依自身判斷使用。
                    </p>
                </section>

                <section class="section">
                    <h2 class="text-2xl font-bold text-accent mb-4 pb-2 border-b border-gray-700">可能的數學或邏輯錯誤</h2>
                    <p class="text-gray-300 leading-relaxed">
                        作者本人數學不太好，邏輯也偶有短路。雖然盡力驗算與整理，但仍有可能出現錯誤公式、理想化假設、或未考慮實戰變因的情況，敬請見諒。
                    </p>
                </section>

                <section class="section">
                    <h2 class="text-2xl font-bold text-accent mb-4 pb-2 border-b border-gray-700">版本更新風險</h2>
                    <p class="text-gray-300 leading-relaxed">
                        隨著遊戲平衡調整、裝備重製、或引擎版本更動，本工具所依據之資料與計算方式可能立即失效或不再適用。請注意與遊戲實際版本同步。
                    </p>
                </section>

                <section class="section">
                    <h2 class="text-2xl font-bold text-accent mb-4 pb-2 border-b border-gray-700">歡迎回報錯誤或建議</h2>
                    <p class="text-gray-300 leading-relaxed">
                        如您發現錯誤或有改進建議，歡迎透過留言、Discord
                        或其他方式回饋。但由於個人時間與能力有限，更新速度不保證，即使讀了也不一定會改 😅
                    </p>
                </section>

                <div class="thank-you mt-8 text-center">
                    <p class="text-xl font-bold text-accent">再次感謝您的使用與支持！</p>
                </div>
            </el-card>

            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6 sm:p-8" v-else>
                <h2 class="text-3xl font-bold text-accent mb-6">🫪 非正式免責聲明（彩蛋吐槽版）</h2>
                <p class="text-gray-300 leading-relaxed mb-6">嗨朋友，感謝你願意花時間來點這個工具，這裡先說在前面：</p>

                <section class="section">
                    <h3 class="text-xl font-bold text-yellow-400 mb-3">1. 數據來源不是天啟，是玩家的肝和錢包堆出來的</h3>
                    <p class="text-gray-300 leading-relaxed mb-3">
                        不是我抓 package 抓到的啦。
                        <br />
                        大多資料都是靠有愛的玩家群體燃燒肝膽與理智，用 Excel、影片慢格、甚至純靠直覺推測出來的。
                    </p>
                    <p class="text-gray-300 leading-relaxed">
                        準嗎？
                        <br />
                        我只能說．……
                        <strong class="text-yellow-400">比沒用好一點啦。</strong>
                    </p>
                </section>

                <section class="section">
                    <h3 class="text-xl font-bold text-yellow-400 mb-3">2. 本工具只是給你參考一下，不要太當真</h3>
                    <p class="text-gray-300 leading-relaxed mb-3">
                        你要用它決定怎麼打王、買裝備、洗錢、拼傷害榜都可以。
                        <br />
                        但最後打不贏、被噹裝、投資失利我一概不負責。
                    </p>
                    <blockquote class="border-l-4 border-gray-600 pl-4 my-4">
                        <p class="text-gray-400"><del>不然你行你自己算啊。</del></p>
                    </blockquote>
                    <p class="text-gray-300 leading-relaxed mb-3">起初我只是想拿來算「換哪個裝備 CP 值比較高」而已，誰知道做著做著變這樣。</p>
                    <p class="text-gray-300 leading-relaxed mb-3">
                        你如果很想知道正確值，不如直接提供你帳號給我，我親自幫你測試也行（
                        <strong class="text-yellow-400">誠徵乾爸乾婦</strong>
                        ）。
                    </p>
                    <p class="text-gray-300 leading-relaxed mb-3">畢竟有些裝備真的好貴喔営営営。</p>
                    <blockquote class="border-l-4 border-gray-600 pl-4 my-4">
                        <p class="text-gray-400">
                            <del>好不容易刷到換上去，竟然只提升個雞毛</del>
                            <br />
                            <del>惡魔貓數值部門死後要手動刷完銳5破袍+ 日月劍才能選擇重生</del>
                        </p>
                    </blockquote>
                    <p class="text-sm text-gray-500 italic border-l-2 border-gray-600 pl-4">
                        //
                        註解：頂裝之一，雖然可以製作，但材料掉落機率非常感人，之前所在的伺服器過了三年靠眾人之力才完成一件。
                    </p>
                </section>

                <section class="section">
                    <h3 class="text-xl font-bold text-yellow-400 mb-3">3. 我數學不好，寫這東西純靠靈感與 Stack Overflow</h3>
                    <p class="text-gray-300 leading-relaxed mb-3">你看到的傷害預測，也許是奇跡，也許是災難。</p>
                    <p class="text-gray-300 leading-relaxed mb-3">有 bug 的話麻煩你先吸一口氣、喝杯水，再來回報。</p>
                    <blockquote class="border-l-4 border-gray-600 pl-4 my-4">
                        <p class="text-gray-400">
                            <del>如果你罵我，我可能會偷哭（也可能會裝沒看到）</del>
                        </p>
                    </blockquote>
                </section>

                <section class="section">
                    <h3 class="text-xl font-bold text-yellow-400 mb-3">4. 改版之後，這網站可能會變廁墓</h3>
                    <p class="text-gray-300 leading-relaxed mb-3">平衡一改、加成邏輯一變，之前算的就全變笑話了。</p>
                    <p class="text-gray-300 leading-relaxed">
                        尤其是那種
                        <strong class="text-yellow-400">惡魔貓爽就改</strong>
                        、
                        <strong class="text-yellow-400">橘子 patch note 沒寫</strong>
                        的情況，我根本無法預測。
                    </p>
                </section>

                <section class="section">
                    <h3 class="text-xl font-bold text-yellow-400 mb-3">5. 回報錯誤我會很感動，但可能會先放著看心情</h3>
                    <p class="text-gray-300 leading-relaxed mb-3">我一定會看，但會不會修、什麼時候修，就看我那週有沒有被工作打爆。</p>
                    <p class="text-gray-300 leading-relaxed">畢竟這不是我正職，也不是收費工具，就當作我跟遊戲一起沈沮的遺產吧。</p>
                </section>

                <div class="thank-you mt-8 text-center">
                    <p class="text-lg text-gray-300 italic">
                        如果你能笑著看完，那這工具也沒發廢。
                        <br />
                        如果你真的覺得這工具有幫助……幫我祈禱裝備好掉一點也行 🙏
                    </p>
                </div>

                <section class="section mt-8">
                    <h2 class="text-2xl font-bold text-accent mb-4 pb-2 border-b border-gray-700">聯絡方式</h2>
                    <p class="text-gray-300 mb-4">如果你真的想找我，可以在以下地方找到：</p>
                    <ul class="list-disc list-inside space-y-2 text-gray-300">
                        <li>
                            <strong class="text-accent">遊戲伺服器：</strong>
                            娜歐
                        </li>
                        <li>
                            <strong class="text-accent">角色ID：</strong>
                            楓羽戀情
                        </li>
                        <li>
                            <strong class="text-accent">GitHub：</strong>
                            <a href="https://github.com/eldisa" target="_blank" rel="noopener noreferrer" class="text-yellow-400 hover:text-yellow-300 underline">eldisa</a>
                        </li>
                    </ul>
                </section>
            </el-card>
        </div>
    </div>
</template>

<style scoped>
.section {
    margin-bottom: 2rem;
}
</style>
