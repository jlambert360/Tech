#Use ./ExtractIcon.ps1 -folder "Program path"
Function ExtractIcon {

    Param ( 
    [Parameter(Mandatory=$true)]
    [string]$folder
    )

    [System.Reflection.Assembly]::LoadWithPartialName('System.Drawing')  | Out-Null

    md $folder -ea 0 | Out-Null

    dir $folder *.exe -ea 0 -rec |
      ForEach-Object { 
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($_.FullName)
        Write-Progress "Extracting Icon" $baseName
        [System.Drawing.Icon]::ExtractAssociatedIcon($_.FullName).ToBitmap().Save("$folder\$BaseName.ico")
    }

}

ExtractIcon -folder "C:\Path"