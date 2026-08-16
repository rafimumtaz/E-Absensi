-- CreateTable
CREATE TABLE "WorkLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radiusMeters" DOUBLE PRECISION NOT NULL,
    "isApprovedRemote" BOOLEAN DEFAULT false,
    "color" TEXT,

    CONSTRAINT "WorkLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkShift" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "graceMinutes" INTEGER NOT NULL,
    "breakDurationMinutes" INTEGER NOT NULL,
    "days" TEXT[],

    CONSTRAINT "WorkShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "employeeCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "avatar" TEXT,
    "phone" TEXT,
    "shiftId" TEXT NOT NULL,
    "assignedLocationId" TEXT NOT NULL,
    "faceEnrolled" BOOLEAN NOT NULL DEFAULT false,
    "enrolledPhotoUrl" TEXT,
    "enrolledAt" TIMESTAMP(3),
    "biometricConfidence" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "employeeCode" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "shiftName" TEXT NOT NULL,
    "punchType" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "serverTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeVerified" BOOLEAN NOT NULL,
    "timeFormatted" TEXT NOT NULL,
    "dateFormatted" TEXT NOT NULL,
    "location" JSONB NOT NULL,
    "biometric" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "verificationHash" TEXT NOT NULL,
    "deviceInfo" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkLocation_code_key" ON "WorkLocation"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeCode_key" ON "Employee"("employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "WorkShift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_assignedLocationId_fkey" FOREIGN KEY ("assignedLocationId") REFERENCES "WorkLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
