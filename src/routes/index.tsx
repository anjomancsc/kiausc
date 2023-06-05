import { component$, useSignal, $ } from "@builder.io/qwik";
import {
  DocumentHead,
  // routeAction$,
  routeLoader$,
} from "@builder.io/qwik-city";
// import { KVNamespace } from "@cloudflare/workers-types";

export const useCourses = routeLoader$(async ({ platform }) => {
  // const { ADMINS } = platform as unknown as { ADMINS: KVNamespace };
  // const adminsRes = await ADMINS.list();
  // const admins = Object.values(adminsRes);
  const courses: string | null = platform.env.COURSES.get("test");
  return {
    courses,
  };
});

// export const useAddUser = routeAction$(async (data, { platform }) => {
// const students = await platform.env.STUDENTS.list();
// console.log(platform.env);
// return {
// ok: true,
// students,
// };
// });

export default component$(() => {
  const firstName = useSignal("");
  const lastName = useSignal("");
  const sex = useSignal("");
  const phoneNumber = useSignal("");
  const studentId = useSignal("");
  const firstNameError = useSignal("");
  const lastNameError = useSignal("");
  const sexError = useSignal("");
  const phoneNumberError = useSignal("");
  const studentIdError = useSignal("");

  const courses = useCourses();

  const submit = $(async () => {
    console.log(courses.value);
    // try {
    //   if (firstName.value === "")
    //     firstNameError.value = "لطفا نام خود را وارد کنید";
    //   else if (!/^[\u0600-\u06FF\s]+$/.test(firstName.value))
    //     firstNameError.value = "لطفا نام خود را به فارسی وارد کنید";
    //   else if (firstName.value.length < 3)
    //     firstNameError.value = "نام خانوادگی وارد شده کوتاه است";
    //   if (lastName.value === "")
    //     lastNameError.value = "لطفا نام خانوادگی خود را وارد کنید";
    //   else if (!/^[\u0600-\u06FF\s]+$/.test(lastName.value))
    //     lastNameError.value = "لطفا نام خانوادگی خود را به فارسی وارد کنید";
    //   else if (lastName.value.length < 3)
    //     lastNameError.value = "نام خانوادگی وارد شده کوتاه است";
    //   if (sex.value === "") sexError.value = "لطفا جنسیت خود را انتخاب کنید";
    //   if (
    //     phoneNumber.value.length != 11 ||
    //     phoneNumber.value[0] != "0" ||
    //     phoneNumber.value[1] != "9"
    //   )
    //     phoneNumberError.value = "شماره موبایل وارد شده معتبر نیست";
    //   if (studentId.value.length < 8 || studentId.value.length > 16)
    //     studentIdError.value = "شماره دانشجویی وارد شده معتبر نیست";
    //   const res = await action.submit({
    //     firstName,
    //     lastName,
    //     sex,
    //     phoneNumber,
    //     studentId,
    //   });
    //   console.log(res);
    // } catch (error) {
    //   console.log(error);
    // }
  });

  return (
    <main class="w-full h-full grid gap-5 grid-cols-12 pr-[120px] pl-8 max-md:px-6">
      <div class="relative col-span-6 max-md:hidden my-auto h-[calc(100%-64px)] overflow-hidden">
        <img
          id="laptop"
          src="/bg.jpg"
          alt="laptop image"
          class="object-cover h-full w-full rounded-3xl rounded-br-[192px]"
        />
        <img
          src="/coffee.png"
          alt="cofee mug image"
          class="w-12 absolute top-[calc(50%-270px)] left-[calc(50%-158px)] animate-bounce-slow"
        />
      </div>
      <div class="col-span-1 max-md:hidden" />
      <div class="col-span-5 max-md:col-span-12 flex flex-col justify-between my-8">
        <div class="mt-auto flex flex-col justify-center w-full text-right">
          <div class="text-[#222222] text-[24px] mb-4 font-bold">ثبت نام</div>
          <div class="text-[#707070] text-[12px] mb-10">
            .اطلاعات خود را برای ثبت نام در دوره وارد کنید
          </div>
          <div>
            <div class="flex flex-col mb-8">
              <label for="first-name" class="mb-4 text-[#2b2b2b] text-[16px]">
                <span class="text-red-500 pr-1">*</span>
                نام
              </label>
              <input
                onChange$={(e) => (firstName.value = e.target.value)}
                type="text"
                id="first-name"
                class={`${
                  firstNameError.value
                    ? "border-[#c30000] border-2"
                    : "border-[#9a9a9a] border-[1px]"
                } rounded px-4 py-3 focus:outline-[#0e8af2]`}
              />
              {firstNameError.value && (
                <div class="text-red-500 text-[12px] pt-2">
                  {firstNameError.value}
                </div>
              )}
            </div>
            <div class="flex flex-col mb-8">
              <label for="last-name" class="mb-4 text-[#2b2b2b] text-[16px]">
                <span class="text-red-500 pr-1">*</span>
                نام خانوادگی
              </label>
              <input
                onChange$={(e) => (lastName.value = e.target.value)}
                type="text"
                id="last-name"
                class={`${
                  lastNameError.value
                    ? "border-[#c30000] border-2"
                    : "border-[#9a9a9a] border-[1px]"
                } rounded px-4 py-3 focus:outline-[#0e8af2]`}
              />
              {lastNameError.value && (
                <div class="text-red-500 text-[12px] pt-2">
                  {lastNameError.value}
                </div>
              )}
            </div>
            <div class="flex flex-col mb-8">
              <div class="mb-4 text-[#2b2b2b] text-[16px]">
                <span class="text-red-500 pr-1">*</span>
                جنسیت
              </div>
              <fieldset
                id="sex"
                class="flex justify-end"
                onChange$={(e) => (sex.value = e.target.id)}
              >
                <label for="male" class="mr-2">
                  مرد
                </label>
                <input type="radio" id="male" name="sex" class="w-5 h-5 mr-8" />
                <label for="female" class="mr-2">
                  زن
                </label>
                <input type="radio" id="female" name="sex" class="w-5 h-5" />
              </fieldset>
              {sexError.value && (
                <div class="text-red-500 text-[12px] pt-2">
                  {sexError.value}
                </div>
              )}
            </div>
            <div class="flex flex-col mb-8">
              <label for="phone-number" class="mb-4 text-[#2b2b2b] text-[16px]">
                <span class="text-red-500 pr-1">*</span>
                شماره موبایل
              </label>
              <input
                placeholder="09181234567"
                onChange$={(e) => (phoneNumber.value = e.target.value)}
                type="number"
                id="phone-number"
                class={`${
                  phoneNumberError.value
                    ? "border-[#c30000] border-2"
                    : "border-[#9a9a9a] border-[1px]"
                } rounded px-4 py-3 ss02 focus:outline-[#0e8af2]`}
              />
              {phoneNumberError.value && (
                <div class="text-red-500 text-[12px] pt-2">
                  {phoneNumberError.value}
                </div>
              )}
            </div>
            <div class="flex flex-col mb-8">
              <label for="student-id" class="mb-4 text-[#2b2b2b] text-[16px]">
                <span class="text-red-500 pr-1">*</span>
                شماره دانشجویی
              </label>
              <input
                onChange$={(e) => (studentId.value = e.target.value)}
                type="number"
                id="student-id"
                class={`${
                  studentIdError.value
                    ? "border-[#c30000] border-2"
                    : "border-[#9a9a9a] border-[1px]"
                } rounded px-4 py-3 ss02 focus:outline-[#0e8af2]`}
              />
              {studentIdError.value && (
                <div class="text-red-500 text-[12px] pt-2">
                  {studentIdError.value}
                </div>
              )}
            </div>
            <button
              onClick$={submit}
              class="bg-[#0e8af2] mb-8 h-12 rounded-lg text-white transition-colors font-bold text-[18px] hover:bg-[#006dc9] w-full"
            >
              ثبت نام
            </button>
          </div>
        </div>
        <div class="mt-auto mb-10 flex justify-center">
          <div class="ss02 pr-6">09025984217</div>
          <div>تلفن پشتیبانی</div>
        </div>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "ثبت نام دوره",
  meta: [
    {
      name: "دوره آشنایی با زبان های برنامه نویسی",
      content: "ثبت نام دوره آشنایی با زبان های برنامه نویسی",
    },
  ],
};
