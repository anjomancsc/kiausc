import { component$, useSignal, $ } from "@builder.io/qwik";
import {
  DocumentHead,
  routeAction$,
  routeLoader$,
} from "@builder.io/qwik-city";
import { KVNamespace } from "@cloudflare/workers-types";

export const useCourses = routeLoader$(async ({ platform }) => {
  if (platform.env) {
    const { COURSES } = platform.env as {
      COURSES: KVNamespace;
    };
    const courses = await COURSES.list();
    return { courses: courses.keys };
  } else {
    return {
      courses: [{ name: "تست" }],
    };
  }
});

export const useAddStudent = routeAction$(async (data, { platform }) => {
  try {
    if (platform.env) {
      const { STUDENTS } = platform.env as {
        STUDENTS: KVNamespace;
      };
      const student = await STUDENTS.get(String(data.studentId));
      if (student) {
        const studentData = JSON.parse(student);
        if (studentData.courses.includes(data.course))
          return {
            ok: false,
            message: "شما قبلا در این دوره ثبت نام کرده اید",
          };
        else {
          const c = data.course;
          delete data.course;
          await STUDENTS.put(
            String(data.studentId),
            JSON.stringify({
              ...data,
              courses: [...studentData.courses, c],
            })
          );
        }
      } else {
        const c = data.course;
        delete data.course;
        await STUDENTS.put(
          String(data.studentId),
          JSON.stringify({ ...data, courses: [c] })
        );
      }
      return {
        ok: true,
      };
    } else {
      return { ok: true };
    }
  } catch (error) {
    console.log(error);
    return {
      ok: false,
    };
  }
});

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
  const courseError = useSignal("");
  const course = useSignal("");
  const courses = useCourses();
  const addStudent = useAddStudent();
  const submitResponse = useSignal("");
  const submitError = useSignal("");

  const submit = $(async () => {
    try {
      if (firstName.value === "") firstNameError.value = "نام خود را وارد کنید";
      else if (!/^[\u0600-\u06FF\s]+$/.test(firstName.value))
        firstNameError.value = "نام خود را به فارسی وارد کنید";
      else if (firstName.value.length < 3)
        firstNameError.value = "نام وارد شده کوتاه است";
      else firstNameError.value = "";
      if (lastName.value === "")
        lastNameError.value = "نام خانوادگی خود را وارد کنید";
      else if (!/^[\u0600-\u06FF\s]+$/.test(lastName.value))
        lastNameError.value = "نام خانوادگی خود را به فارسی وارد کنید";
      else if (lastName.value.length < 3)
        lastNameError.value = "نام خانوادگی وارد شده کوتاه است";
      else lastNameError.value = "";
      if (sex.value === "") sexError.value = "جنسیت خود را انتخاب کنید";
      else sexError.value = "";
      if (phoneNumber.value.length === 0)
        phoneNumberError.value = "شماره موبایل خود را وارد کنید";
      else if (
        phoneNumber.value.length != 11 ||
        phoneNumber.value[0] != "0" ||
        phoneNumber.value[1] != "9"
      )
        phoneNumberError.value = "شماره موبایل وارد شده معتبر نیست";
      else phoneNumberError.value = "";
      if (studentId.value.length === 0)
        studentIdError.value = "شماره دانشجویی خود را وارد کنید";
      else if (studentId.value.length < 8 || studentId.value.length > 18)
        studentIdError.value = "شماره دانشجویی وارد شده معتبر نیست";
      else studentIdError.value = "";
      if (course.value === "") courseError.value = "نام دوره را انتخاب کنید";
      else courseError.value = "";

      if (
        firstNameError.value ||
        lastNameError.value ||
        phoneNumberError.value ||
        studentIdError.value ||
        courseError.value
      )
        return;

      submitError.value = "";
      submitResponse.value = "";

      const res = await addStudent.submit({
        firstName: firstName.value,
        lastName: lastName.value,
        sex: sex.value,
        phoneNumber: phoneNumber.value,
        studentId: studentId.value,
        course: course.value,
      });
      console.log(res.value);
      if (res.value.ok) {
        submitResponse.value = "ثبت نام با موفقیت انجام شد";
        const player = document.querySelector("lottie-player");
        if (player) {
          (player as any).load(
            "https://assets4.lottiefiles.com/packages/lf20_wcnjmdp1.json"
          );
        }
      } else submitError.value = res.value.message || "ثبت نام با خطا مواجه شد";
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <main class="w-full h-full grid gap-5 grid-cols-12 max-md:px-6 md:pr-[120px] overflow-x-hidden">
      <div class="relative col-span-6 max-md:hidden my-auto h-full">
        <span class="absolute top-0 left-0 z-10 text-white text-center w-full mt-16 text-lg">
          دوره های انجمن علمی دانشگاه آزاد اسلامی واحد کرمانشاه
        </span>
        <img
          id="laptop"
          src="/bg.jpg"
          alt="laptop image"
          class="object-cover h-full w-full absolute"
        />
        <img
          src="/coffee.png"
          alt="cofee mug image"
          class="w-12 absolute top-[calc(50%-270px)] left-[calc(50%-158px)] animate-bounce-slow"
        />
      </div>
      <div class="col-span-1 max-md:hidden" />
      <div class="col-span-5 max-md:col-span-12 flex flex-col justify-between py-8">
        <div class="mt-auto flex flex-col justify-center w-full text-right">
          <div class="text-[#222222] text-[24px] mb-4 font-bold">ثبت نام</div>
          <div class="text-[#707070] text-[12px] mb-10">
            .اطلاعات خود را برای ثبت نام در دوره وارد کنید
          </div>
          <div>
            <div class="flex flex-col md:flex-row-reverse md:mb-8">
              <div class="flex flex-col w-full md:mb-0 mb-8">
                <label for="first-name" class="mb-4 text-[#2b2b2b] text-[16px]">
                  <span class="text-red-500 pr-1">*</span>
                  نام
                </label>
                <input
                  placeholder="علی"
                  onChange$={(e) => (firstName.value = e.target.value)}
                  type="text"
                  id="first-name"
                  class={`${
                    firstNameError.value
                      ? "border-[#c30000] border-2"
                      : "border-[#9a9a9a] border-[1px]"
                  } rounded px-4 h-[48px] focus:outline-[#0e8af2] w-full`}
                />
                {firstNameError.value && (
                  <div class="text-red-500 text-[12px] pt-2">
                    {firstNameError.value}
                  </div>
                )}
              </div>
              <div class="w-5 hidden md:block"></div>
              <div class="flex flex-col w-full md:mb-0 mb-8">
                <label for="last-name" class="mb-4 text-[#2b2b2b] text-[16px]">
                  <span class="text-red-500 pr-1">*</span>
                  نام خانوادگی
                </label>
                <input
                  placeholder="محمدی"
                  onChange$={(e) => (lastName.value = e.target.value)}
                  type="text"
                  id="last-name"
                  class={`${
                    lastNameError.value
                      ? "border-[#c30000] border-2"
                      : "border-[#9a9a9a] border-[1px]"
                  } rounded px-4 h-[48px] focus:outline-[#0e8af2] w-full`}
                />
                {lastNameError.value && (
                  <div class="text-red-500 text-[12px] pt-2">
                    {lastNameError.value}
                  </div>
                )}
              </div>
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
                } rounded px-4 h-[48px] ss02 focus:outline-[#0e8af2]`}
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
                placeholder="992123456"
                onChange$={(e) => (studentId.value = e.target.value)}
                type="number"
                id="student-id"
                class={`${
                  studentIdError.value
                    ? "border-[#c30000] border-2"
                    : "border-[#9a9a9a] border-[1px]"
                } rounded px-4 h-[48px] ss02 focus:outline-[#0e8af2]`}
              />
              {studentIdError.value && (
                <div class="text-red-500 text-[12px] pt-2">
                  {studentIdError.value}
                </div>
              )}
            </div>
            <div class="flex flex-col mb-8">
              <label for="courses" class="mb-4 text-[#2b2b2b] text-[16px]">
                <span class="text-red-500 pr-1">*</span>
                نام دوره
              </label>
              <div class="w-full relative">
                <select
                  bind:value={course}
                  name="couses"
                  id="courses"
                  class={`${
                    courseError.value
                      ? "border-2 border-red-500"
                      : "focus:outline-blue-500 border-[#9a9a9a] border-[1px]"
                  } w-full appearance-none text-right rounded px-4 h-[48px]`}
                >
                  <option value="" class="hover:bg-[#838383]">
                    ...انتخاب کنید
                  </option>
                  {courses.value.courses.map((c) => (
                    <option value={c.name} class="hover:bg-[#838383]">
                      {c.name}
                    </option>
                  ))}
                </select>
                <span class="left-3 top-5 w-2 h-2 border-t-2 border-r-2 border-black rotate-[135deg] absolute"></span>
              </div>
              {courseError.value && (
                <div class="text-red-500 text-[12px] pt-2">
                  {courseError.value}
                </div>
              )}
            </div>
            <div class="mb-8">
              <button
                disabled={addStudent.isRunning}
                onClick$={submit}
                class="bg-[#0e8af2] h-12 rounded text-white transition-colors font-bold text-[18px] hover:bg-[#006dc9] w-full flex justify-center items-center"
              >
                {addStudent.isRunning ? (
                  <div class="rounded-full w-8 h-8 border-white border-b-2 animate-spin"></div>
                ) : (
                  <div>ثبت نام</div>
                )}
              </button>
              {submitError.value && (
                <div class="text-red-500 text-xs mt-2">{submitError.value}</div>
              )}
            </div>
          </div>
        </div>
        <div class="mt-auto mb-10 pt-6 flex justify-center">
          <div class="ss02 pr-6">09025984217</div>
          <div>تلفن پشتیبانی</div>
        </div>
      </div>
      <div
        class={`${
          submitResponse.value ? "block" : "hidden"
        } absolute top-0 left-0 z-20 flex items-center justify-center w-full h-full bg-black bg-opacity-75`}
      >
        <div class="mx-6 w-[400px] h-[400px] rounded-3xl bg-white shadow-2xl flex flex-col items-center justify-center">
          <lottie-player
            autoplay
            id="success-animation"
            class="w-[116px] h-[116px]"
          ></lottie-player>
          <div class="text-[#2b2b2b] text-[24px] font-bold">
            !ثبت نام با موفقیت انجام شد
          </div>
          <button
            onClick$={() => (submitResponse.value = "")}
            class="bg-[#0e8af2] h-12 rounded mt-8 w-24 text-white transition-colors font-bold text-[18px] hover:bg-[#006dc9]"
          >
            بستن
          </button>
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
